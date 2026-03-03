import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../../data/mockData';
import { getAssetsFiltered } from '../../data/mockData';
import { getAIRecommendation } from '../../services/aiService';
import RecommendationsTable from './RecommendationsTable';
import './Recommendations.css';

const Recommendations = ({ selectedMonth, selectedYear, filters }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState({}); // Store AI recs by asset_id

  useEffect(() => {
    loadRecommendations();
  }, [selectedMonth, selectedYear, filters]);

  useEffect(() => {
    // Generate AI recommendations when filters change (debounced)
    const timer = setTimeout(() => {
      const hasFilters = Object.keys(filters).some(key => filters[key]);
      if (hasFilters) {
        console.log('Filters changed, generating AI recommendations...', filters);
        generateAIRecommendationsForFiltered();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectedMonth, selectedYear]);

  const loadRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      // Map month abbreviations to full names
      const monthMap = {
        'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
        'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
        'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
      };
      const monthName = monthMap[selectedMonth] || selectedMonth;
      
      const filterParams = {
        year: selectedYear,
        ...filters,
      };
      
      // Only add month filter if we have a valid month name
      if (monthName && monthName !== selectedMonth) {
        filterParams.month = monthName;
      }
      
      const data = getRecommendations(filterParams);
      console.log('Loaded recommendations:', data.length, 'with filters:', filterParams, 'month:', monthName);
      setRecommendations(data);
      setLoading(false);
    }, 300);
  };

  const generateAIRecommendationsForFiltered = async () => {
    const filteredAssets = getAssetsFiltered(filters);
    const newAIRecommendations = {};
    
    console.log(`Generating AI recommendations for ${filteredAssets.length} filtered assets`);
    
    // Generate AI recommendations for filtered assets (limit to 3 to avoid too many API calls)
    for (const asset of filteredAssets.slice(0, 3)) {
      try {
        console.log(`Calling AI for asset: ${asset.asset_id}`);
        const recommendation = await getAIRecommendation({
          ...asset,
          month: selectedMonth,
          year: selectedYear,
          filterContext: filters,
          timestamp: new Date().toISOString() // Add timestamp for variety
        });
        newAIRecommendations[asset.asset_id] = recommendation;
        console.log(`AI recommendation received for ${asset.asset_id}`);
      } catch (error) {
        console.error(`Error getting AI recommendation for ${asset.asset_id}:`, error);
      }
    }
    
    setAiRecommendations(prev => ({ ...prev, ...newAIRecommendations }));
  };

  const handleGetAIRecommendation = async (assetId) => {
    // Check if we already have an AI recommendation for this asset
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
        filterContext: filters
      });
      setAiRecommendation(recommendation);
      setAiRecommendations(prev => ({ ...prev, [assetId]: recommendation }));
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      setAiRecommendation('Unable to generate AI recommendation at this time. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="recommendations-page">
      <h2 className="page-title">RECOMMENDATIONS</h2>
      <RecommendationsTable 
        recommendations={recommendations}
        onGetAIRecommendation={handleGetAIRecommendation}
        loadingAI={loadingAI}
        aiRecommendation={aiRecommendation}
        aiRecommendations={aiRecommendations}
        onClosePopup={() => setAiRecommendation(null)}
      />
    </div>
  );
};

export default Recommendations;

