import React, { useState, useEffect, useMemo } from 'react';
import { getRecommendations, getAssetsFiltered } from '../../data/mockData';
import { getAIRecommendation } from '../../services/aiService';
import { buildExecutiveKpiModel, formatKpiDigestForPrompt } from '../../utils/executiveKpiModel';
import RecommendationActionCards from './RecommendationActionCards';
import SelectPlaceGate from '../Layout/SelectPlaceGate';
import { DataFeedHint, OperationalActionsPanel } from '../Agentic/IntegratedDataPanels';
import { usePageChatKnowledge } from '../../context/ChatAssistantContext';
import { useAppFlow } from '../../context/AppFlowContext';
import ManagerScopeBanner from '../Layout/ManagerScopeBanner';
import { operatorRoleShort } from '../../utils/operatorRole';
import './Recommendations.css';

const Recommendations = ({ selectedMonth, selectedYear, filters, onFiltersChange }) => {
  const { flow, excelBundle } = useAppFlow();
  const isManager = flow.accountRole === 'manager';
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState({});

  useEffect(() => {
    loadRecommendations();
  }, [selectedMonth, selectedYear, filters, flow.operatorRole, flow.accountRole]);

  useEffect(() => {
    if (isManager) return undefined;
    const timer = setTimeout(() => {
      const hasFilters = Object.keys(filters).some((key) => filters[key]);
      if (hasFilters) {
        generateAIRecommendationsForFiltered();
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectedMonth, selectedYear, flow.operatorRole, isManager]);

  const loadRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      const monthMap = {
        Jan: 'January',
        Feb: 'February',
        Mar: 'March',
        Apr: 'April',
        May: 'May',
        Jun: 'June',
        Jul: 'July',
        Aug: 'August',
        Sep: 'September',
        Oct: 'October',
        Nov: 'November',
        Dec: 'December',
      };
      const monthName = monthMap[selectedMonth] || selectedMonth;
      const filterParams = {
        year: selectedYear,
        ...filters,
      };
      if (monthName && monthName !== selectedMonth) {
        filterParams.month = monthName;
      }
      const data = getRecommendations(filterParams, { operatorRole: flow.operatorRole });
      setRecommendations(data);
      setLoading(false);
    }, 300);
  };

  const kpiDigestForAi = useMemo(() => {
    const m = buildExecutiveKpiModel({
      filters,
      operatorRole: flow.operatorRole,
      qcGo: flow.outcome === 'go',
      selectedMonth,
      selectedYear,
      excelBundle: excelBundle || {},
    });
    return formatKpiDigestForPrompt(m);
  }, [filters, flow.operatorRole, flow.outcome, selectedMonth, selectedYear, excelBundle]);

  const generateAIRecommendationsForFiltered = async () => {
    const filteredAssets = getAssetsFiltered(filters, { operatorRole: flow.operatorRole });
    const newAIRecommendations = {};
    for (const asset of filteredAssets.slice(0, 3)) {
      try {
        const recommendation = await getAIRecommendation({
          ...asset,
          month: selectedMonth,
          year: selectedYear,
          filterContext: filters,
          timestamp: new Date().toISOString(),
          kpiDigestForAi,
        });
        newAIRecommendations[asset.asset_id] = recommendation;
      } catch {
        /* non-blocking */
      }
    }
    setAiRecommendations((prev) => ({ ...prev, ...newAIRecommendations }));
  };

  const handleGetAIRecommendation = async (assetId) => {
    if (aiRecommendations[assetId]) {
      setAiRecommendation(aiRecommendations[assetId]);
      return;
    }
    setLoadingAI(true);
    try {
      const assets = getAssetsFiltered({ asset_id: assetId }, { operatorRole: flow.operatorRole });
      const assetData = assets[0] || { asset_id: assetId, status: 'Unknown' };
      const recommendation = await getAIRecommendation({
        ...assetData,
        month: selectedMonth,
        year: selectedYear,
        filterContext: filters,
        kpiDigestForAi,
      });
      setAiRecommendation(recommendation);
      setAiRecommendations((prev) => ({ ...prev, [assetId]: recommendation }));
    } catch {
      setAiRecommendation('Guidance could not be synthesized. Retry shortly.');
    } finally {
      setLoadingAI(false);
    }
  };

  const recChatKnowledge = useMemo(() => {
    if (!filters.state) {
      return 'Recommendations: no state selected; user must pick a site to load the action queue.';
    }
    return JSON.stringify(
      {
        view: 'recommendations',
        filters,
        period: { month: selectedMonth, year: selectedYear },
        loading,
        recommendationCount: recommendations.length,
        recommendationSample: recommendations.slice(0, 20),
        aiGuidanceAssetIds: Object.keys(aiRecommendations),
        operatorRole: flow.operatorRole,
        accountRole: flow.accountRole,
        managerBreakdownScope: isManager,
      },
      null,
      2
    );
  }, [filters, selectedMonth, selectedYear, loading, recommendations, aiRecommendations, flow.operatorRole, flow.accountRole, isManager]);

  usePageChatKnowledge(recChatKnowledge);

  if (!filters.state) {
    return (
      <div className="recommendations-page">
        <h2 className="page-title">Prioritized actions</h2>
        <SelectPlaceGate
          filters={filters}
          onFiltersChange={onFiltersChange}
          title="Select a location for recommendations"
          hint="Actions and asset guidance are filtered by site. Choose Beloit or Jonesboro to load the recommendation queue for this step."
        />
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="recommendations-page">
      <h2 className="page-title">Prioritized actions</h2>
      {isManager ? <ManagerScopeBanner /> : null}
      <p className="agentic-section-intro">
        {isManager ? (
          <>
            <strong>{operatorRoleShort(flow.operatorRole)}</strong> — the action queue matches your Executive summary
            context for this site, with emphasis on follow-up for assets in <strong>production stoppage</strong>. Open
            synthesized guidance per asset when you want deeper execution text.
          </>
        ) : (
          <>
            <strong>{operatorRoleShort(flow.operatorRole)}</strong> — dual recommendation engines: processing-line (fryer /
            slicer / seasoning) vs packaging-line (palletizer / case equipment) produce different actions for the same
            asset signal. Countermeasures fuse reliability, safety, and throughput; open synthesized guidance per asset when
            you need execution detail.
          </>
        )}
      </p>

      {!isManager ? <DataFeedHint /> : null}
      {!isManager ? (
        <>
          <h3 className="rec-section-label">Cross-system action queue</h3>
          <OperationalActionsPanel />
        </>
      ) : null}

      <h3 className="rec-section-label">Asset-specific guidance</h3>
      <RecommendationActionCards
        recommendations={recommendations}
        onGetAIRecommendation={handleGetAIRecommendation}
        loadingAI={loadingAI}
        aiRecommendation={aiRecommendation}
        aiRecommendations={aiRecommendations}
        onClosePopup={() => setAiRecommendation(null)}
        userEmail={flow.userEmail}
        operatorRole={flow.operatorRole}
      />

      <div className="rec-legend">
        <div className="rec-legend-item">
          <span className="rec-legend-swatch" style={{ backgroundColor: 'var(--color-breakdown)' }} />
          <span>Breakdown</span>
        </div>
        {!isManager ? (
          <>
            <div className="rec-legend-item">
              <span className="rec-legend-swatch" style={{ backgroundColor: 'var(--color-failure-predicted)' }} />
              <span>Failure predicted</span>
            </div>
            <div className="rec-legend-item">
              <span className="rec-legend-swatch" style={{ backgroundColor: 'var(--color-under-maintenance)' }} />
              <span>Under maintenance</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Recommendations;
