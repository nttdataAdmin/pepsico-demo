import React, { useState, useMemo, useCallback } from 'react';
import { formatCmmsRecommendationRecordLine, getAssignableWorkcenterRoleNames } from '../../data/mockData';
import RecommendationReviewControls from './RecommendationReviewControls';
import './RecommendationsTable.css';
import './RecommendationActionCards.css';

function defaultRecReview() {
  return { assignee: '__self__', decision: null, amendedText: '', editing: false, editDraft: '' };
}

const RecommendationActionCards = ({
  recommendations,
  onGetAIRecommendation,
  loadingAI,
  aiRecommendation,
  aiRecommendations,
  onClosePopup,
  userEmail,
}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [reviewByAsset, setReviewByAsset] = useState({});
  const assignableRoles = useMemo(() => getAssignableWorkcenterRoleNames(), []);

  const patchReview = useCallback((assetId, patch) => {
    setReviewByAsset((prev) => ({
      ...prev,
      [assetId]: { ...defaultRecReview(), ...prev[assetId], ...patch },
    }));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Breakdown':
        return 'var(--color-breakdown)';
      case 'Failure Predicted':
        return 'var(--color-failure-predicted)';
      case 'Under Maintenance':
        return 'var(--color-under-maintenance)';
      default:
        return '#8899a8';
    }
  };

  const handleOpenAi = (assetId) => {
    setSelectedAsset(assetId);
    onGetAIRecommendation(assetId);
  };

  const rev = selectedAsset ? { ...defaultRecReview(), ...reviewByAsset[selectedAsset] } : null;
  const displayedAi =
    rev?.decision === 'edited' && String(rev.amendedText || '').trim() ? rev.amendedText : aiRecommendation;

  if (!recommendations.length) {
    return (
      <p className="rec-cards-empty">
        No asset-level recommendations for the current filters. Adjust scope in the header or move to Anomalies
        for live triggers.
      </p>
    );
  }

  return (
    <div className="rec-cards-root">
      <div className="rec-cards-grid">
        {recommendations.map((rec, index) => (
          <article key={`${rec.asset_id}-${index}`} className="rec-action-card">
            <div className="rec-action-card-top">
              <span className="rec-action-asset" style={{ borderColor: getStatusColor(rec.status) }}>
                {rec.asset_id}
              </span>
              <span className="rec-action-status" style={{ backgroundColor: getStatusColor(rec.status) }}>
                {rec.status}
              </span>
            </div>
            <p className="rec-action-loc">
              {rec.plant} · {rec.state} · {rec.month} {rec.year}
            </p>
            <p className="rec-action-type">{rec.asset_type}</p>
            {rec.recommendation_engine ? (
              <span className="rec-engine-pill" title="Role-selected recommendation engine">
                {rec.recommendation_engine === 'packaging_line' ? 'Packaging-line engine' : 'Processing-line engine'}
              </span>
            ) : null}
            {rec.criticality ? (
              <p className="rec-action-criticality">Criticality: {rec.criticality}</p>
            ) : null}
            <p className="rec-action-cmms">{formatCmmsRecommendationRecordLine(rec)}</p>
            <p className="rec-action-text">{rec.recommendation || 'Review asset context and open synthesized guidance.'}</p>
            <button
              type="button"
              className="rec-action-ai-btn"
              onClick={() => handleOpenAi(rec.asset_id)}
              disabled={loadingAI}
            >
              {loadingAI && selectedAsset === rec.asset_id ? 'Synthesizing…' : 'Open synthesized guidance'}
            </button>
            {aiRecommendations[rec.asset_id] && (
              <p className="rec-action-cached">Guidance cached for this asset in-session.</p>
            )}
          </article>
        ))}
      </div>

      {aiRecommendation && selectedAsset && (
        <div
          className="ai-recommendation-overlay"
          onClick={(e) => {
            if (e.target.className === 'ai-recommendation-overlay') {
              setSelectedAsset(null);
              if (onClosePopup) onClosePopup();
            }
          }}
        >
          <div className="ai-recommendation-popup card">
            <div className="ai-header">
              <h3>Synthesized guidance · {selectedAsset}</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setSelectedAsset(null);
                  if (onClosePopup) onClosePopup();
                }}
              >
                ×
              </button>
            </div>
            <div className="ai-content">
              <div className="ai-steps">
                {(displayedAi || '').split('\n').map((line, index) => {
                  if (line.trim() === '') return <br key={index} />;
                  if (line.match(/^#{1,3}\s/)) {
                    const level = line.match(/^#+/)[0].length;
                    const text = line.replace(/^#+\s/, '');
                    return (
                      <h4 key={index} className={`ai-heading h${level}`}>
                        {text}
                      </h4>
                    );
                  }
                  if (line.includes('**')) {
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <div key={index} className="ai-step">
                        {parts.map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                          }
                          return <span key={i}>{part}</span>;
                        })}
                      </div>
                    );
                  }
                  if (line.match(/^\d+[\.\)]\s/) || line.match(/^[-*•]\s/)) {
                    if (line.includes('*') && !line.includes('**')) {
                      const parts = line.split(/(\*[^*]+\*)/g);
                      return (
                        <div key={index} className="ai-step">
                          {parts.map((part, i) => {
                            if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
                              return <strong key={i}>{part.slice(1, -1)}</strong>;
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="ai-step">
                        {line.trim()}
                      </div>
                    );
                  }
                  if (line.match(/^[A-Z][^:]+:/) && line.split(':').length === 2) {
                    const [title, content] = line.split(':');
                    return (
                      <div key={index} className="ai-section">
                        <strong className="section-title">{title}:</strong>
                        <span className="section-content">{content}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={index} className="ai-text">
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedAsset && aiRecommendation ? (
              <RecommendationReviewControls
                assignee={rev.assignee}
                assignableRoles={assignableRoles}
                userEmail={userEmail}
                decision={rev.decision}
                editing={rev.editing}
                editDraft={rev.editing ? rev.editDraft : ''}
                onAssigneeChange={(v) => patchReview(selectedAsset, { assignee: v })}
                onEditDraftChange={(v) => patchReview(selectedAsset, { editDraft: v })}
                onAccept={() => patchReview(selectedAsset, { decision: 'accepted', editing: false })}
                onDecline={() => patchReview(selectedAsset, { decision: 'declined', editing: false })}
                onStartEdit={() => patchReview(selectedAsset, { editing: true, editDraft: aiRecommendation || '' })}
                onCancelEdit={() => patchReview(selectedAsset, { editing: false, editDraft: '' })}
                onSaveEdit={() => {
                  const aid = selectedAsset;
                  const base = aiRecommendation;
                  setReviewByAsset((prev) => {
                    const cur = { ...defaultRecReview(), ...prev[aid] };
                    const text = String(cur.editDraft || '').trim() || (base || '');
                    return {
                      ...prev,
                      [aid]: {
                        ...cur,
                        decision: 'edited',
                        amendedText: text,
                        editing: false,
                        editDraft: '',
                      },
                    };
                  });
                }}
                onClearDecision={() => patchReview(selectedAsset, { decision: null, amendedText: '', editing: false })}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationActionCards;
