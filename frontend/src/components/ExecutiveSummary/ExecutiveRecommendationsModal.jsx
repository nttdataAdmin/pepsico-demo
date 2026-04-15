import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getRecommendations, getAssetsFiltered, getAssignableWorkcenterRoleNames } from '../../data/mockData';
import { getAIRecommendation } from '../../services/aiService';
import RecommendationReviewControls from '../Recommendations/RecommendationReviewControls';
import './ExecutiveRecommendationsModal.css';

function defaultRecReview() {
  return { assignee: '__self__', decision: null, amendedText: '', editing: false, editDraft: '' };
}

function rowKey(r) {
  return `${r.asset_id}-${r.month}-${r.recommendation_engine || ''}`;
}

export default function ExecutiveRecommendationsModal({
  open,
  onClose,
  filters,
  selectedMonth,
  selectedYear,
  operatorRole,
  userEmail,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [guidance, setGuidance] = useState(null);
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [reviewByKey, setReviewByKey] = useState({});
  const assignableRoles = useMemo(() => getAssignableWorkcenterRoleNames(), []);

  const patchReview = useCallback((key, patch) => {
    if (!key) return;
    setReviewByKey((prev) => ({
      ...prev,
      [key]: { ...defaultRecReview(), ...prev[key], ...patch },
    }));
  }, []);

  const filterParams = useMemo(() => {
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
    return {
      year: selectedYear,
      ...filters,
      ...(monthName && monthName !== selectedMonth ? { month: monthName } : {}),
    };
  }, [filters, selectedMonth, selectedYear]);

  useEffect(() => {
    if (!open) {
      setSelectedKey(null);
      setGuidance(null);
      setGuidanceLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      const data = getRecommendations(filterParams, { operatorRole });
      setRows(data.slice(0, 8));
      setLoading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [open, filterParams, operatorRole]);

  useEffect(() => {
    setSelectedKey(null);
    setGuidance(null);
    setGuidanceLoading(false);
    setReviewByKey({});
  }, [rows]);

  const loadGuidance = useCallback(
    async (r) => {
      const key = rowKey(r);
      setSelectedKey(key);
      setGuidance(null);
      setGuidanceLoading(true);
      const assetRow = getAssetsFiltered({ asset_id: r.asset_id }, { operatorRole })[0] || {};
      const payload = {
        ...assetRow,
        asset_id: r.asset_id,
        asset_type: r.asset_type ?? assetRow.asset_type,
        status: r.status ?? assetRow.status,
        criticality: r.criticality ?? assetRow.criticality,
        plant: r.plant ?? assetRow.plant,
        state: r.state ?? assetRow.state,
        month: r.month || filterParams.month || selectedMonth,
        year: r.year ?? selectedYear,
        filterContext: filters,
        timestamp: new Date().toISOString(),
      };
      try {
        const text = await getAIRecommendation(payload);
        setGuidance(typeof text === 'string' ? text : String(text));
      } catch {
        setGuidance('Guidance could not be synthesized. Try again or check the assistant configuration.');
      } finally {
        setGuidanceLoading(false);
      }
    },
    [filterParams.month, filters, operatorRole, selectedMonth, selectedYear]
  );

  if (!open) return null;

  const rev = selectedKey ? { ...defaultRecReview(), ...reviewByKey[selectedKey] } : null;
  const displayedGuidance =
    rev?.decision === 'edited' && String(rev.amendedText || '').trim() ? rev.amendedText : guidance;

  const modal = (
    <div
      className="es-rec-modal-overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="es-rec-modal" role="dialog" aria-modal="true" aria-labelledby="es-rec-modal-title">
        <header className="es-rec-modal-header">
          <h2 id="es-rec-modal-title">Recommendations snapshot</h2>
          <button type="button" className="es-rec-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <p className="es-rec-modal-intro">
          Prioritized actions for your signed-in role and location scope. Click a row for <strong>synthesised guidance</strong>.
          Use <strong>Enter detailed analysis</strong> on the executive page when you need the full five-tab workspace
          (Anomalies → RCA → Actions → Planned downtime).
        </p>
        {loading ? (
          <p className="es-rec-modal-loading">Loading recommendation queue…</p>
        ) : !filters.state ? (
          <p className="es-rec-modal-empty">Select a state / site above to hydrate this list.</p>
        ) : rows.length === 0 ? (
          <p className="es-rec-modal-empty">No queued actions in this scope for the demo dataset.</p>
        ) : (
          <div className="es-rec-modal-body">
            <ul className="es-rec-modal-list">
              {rows.map((r) => {
                const k = rowKey(r);
                const selected = selectedKey === k;
                return (
                  <li key={k} className="es-rec-modal-li">
                    <button
                      type="button"
                      className={`es-rec-modal-item ${selected ? 'es-rec-modal-item--selected' : ''}`}
                      onClick={() => loadGuidance(r)}
                    >
                      <div className="es-rec-modal-item-top">
                        <strong>{r.asset_id}</strong>
                        <span className="es-rec-modal-pill">{r.status}</span>
                      </div>
                      <div className="es-rec-modal-item-meta">
                        {r.plant} · {r.state}
                      </div>
                      <p className="es-rec-modal-item-text">{r.recommendation}</p>
                      <span className="es-rec-modal-item-hint">Click for synthesised guidance</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {(selectedKey || guidanceLoading) && (
              <aside className="es-rec-modal-guidance" aria-live="polite">
                <h3 className="es-rec-modal-guidance-title">Synthesised guidance</h3>
                {guidanceLoading ? (
                  <p className="es-rec-modal-guidance-loading">Generating guidance…</p>
                ) : displayedGuidance ? (
                  <div className="es-rec-modal-guidance-body">{displayedGuidance}</div>
                ) : null}
                {selectedKey && !guidanceLoading && guidance ? (
                  <RecommendationReviewControls
                    assignee={rev.assignee}
                    assignableRoles={assignableRoles}
                    userEmail={userEmail}
                    decision={rev.decision}
                    editing={rev.editing}
                    editDraft={rev.editing ? rev.editDraft : ''}
                    onAssigneeChange={(v) => patchReview(selectedKey, { assignee: v })}
                    onEditDraftChange={(v) => patchReview(selectedKey, { editDraft: v })}
                    onAccept={() => patchReview(selectedKey, { decision: 'accepted', editing: false })}
                    onDecline={() => patchReview(selectedKey, { decision: 'declined', editing: false })}
                    onStartEdit={() => patchReview(selectedKey, { editing: true, editDraft: guidance || '' })}
                    onCancelEdit={() => patchReview(selectedKey, { editing: false, editDraft: '' })}
                    onSaveEdit={() => {
                      const g = guidance;
                      const k = selectedKey;
                      setReviewByKey((prev) => {
                        const cur = { ...defaultRecReview(), ...prev[k] };
                        const text = String(cur.editDraft || '').trim() || (g || '');
                        return {
                          ...prev,
                          [k]: {
                            ...cur,
                            decision: 'edited',
                            amendedText: text,
                            editing: false,
                            editDraft: '',
                          },
                        };
                      });
                    }}
                    onClearDecision={() => patchReview(selectedKey, { decision: null, amendedText: '', editing: false })}
                  />
                ) : null}
              </aside>
            )}
          </div>
        )}
        <footer className="es-rec-modal-footer">
          <button type="button" className="es-rec-modal-btn" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
