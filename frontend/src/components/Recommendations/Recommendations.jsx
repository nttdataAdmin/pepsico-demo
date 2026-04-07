import React, { useState, useEffect, useMemo } from 'react';
import { getRecommendations, getAssetsFiltered } from '../../data/mockData';
import { getAIRecommendation } from '../../services/aiService';
import RecommendationActionCards from './RecommendationActionCards';
import SelectPlaceGate from '../Layout/SelectPlaceGate';
import { DataFeedHint, OperationalActionsPanel } from '../Agentic/IntegratedDataPanels';
import { usePageChatKnowledge } from '../../context/ChatAssistantContext';
import './Recommendations.css';

const Recommendations = ({ selectedMonth, selectedYear, filters, onFiltersChange }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState({});

  useEffect(() => {
    loadRecommendations();
  }, [selectedMonth, selectedYear, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasFilters = Object.keys(filters).some((key) => filters[key]);
      if (hasFilters) {
        generateAIRecommendationsForFiltered();
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectedMonth, selectedYear]);

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
      const data = getRecommendations(filterParams);
      setRecommendations(data);
      setLoading(false);
    }, 300);
  };

  const generateAIRecommendationsForFiltered = async () => {
    const filteredAssets = getAssetsFiltered(filters);
    const newAIRecommendations = {};
    for (const asset of filteredAssets.slice(0, 3)) {
      try {
        const recommendation = await getAIRecommendation({
          ...asset,
          month: selectedMonth,
          year: selectedYear,
          filterContext: filters,
          timestamp: new Date().toISOString(),
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
      const assets = getAssetsFiltered({ asset_id: assetId });
      const assetData = assets[0] || { asset_id: assetId, status: 'Unknown' };
      const recommendation = await getAIRecommendation({
        ...assetData,
        month: selectedMonth,
        year: selectedYear,
        filterContext: filters,
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
      },
      null,
      2
    );
  }, [filters, selectedMonth, selectedYear, loading, recommendations, aiRecommendations]);

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
      <p className="agentic-section-intro">
        Countermeasures are ranked from fused reliability, safety, and throughput signals. Open synthesized
        guidance per asset when you need step-by-step execution detail—without leaving this view.
      </p>

      <DataFeedHint />
      <h3 className="rec-section-label">Cross-system action queue</h3>
      <OperationalActionsPanel />

      <h3 className="rec-section-label">Asset-specific guidance</h3>
      <RecommendationActionCards
        recommendations={recommendations}
        onGetAIRecommendation={handleGetAIRecommendation}
        loadingAI={loadingAI}
        aiRecommendation={aiRecommendation}
        aiRecommendations={aiRecommendations}
        onClosePopup={() => setAiRecommendation(null)}
      />

      <div className="rec-legend">
        <div className="rec-legend-item">
          <span className="rec-legend-swatch" style={{ backgroundColor: 'var(--color-breakdown)' }} />
          <span>Breakdown</span>
        </div>
        <div className="rec-legend-item">
          <span className="rec-legend-swatch" style={{ backgroundColor: 'var(--color-failure-predicted)' }} />
          <span>Failure predicted</span>
        </div>
        <div className="rec-legend-item">
          <span className="rec-legend-swatch" style={{ backgroundColor: 'var(--color-under-maintenance)' }} />
          <span>Under maintenance</span>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
