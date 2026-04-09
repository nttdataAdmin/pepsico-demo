import React from 'react';
import './FormProcessingOverlay.css';

export const PROCESSING_STEPS = [
  { id: 'mfg', label: 'MFG Pro+ · Scheduler sync' },
  { id: 'load', label: 'Loading document & job slot…' },
  { id: 'extract', label: 'Extract text (OCR / layout)…' },
  { id: 'classify', label: 'Classify Go / No-Go…' },
];

export default function FormProcessingOverlay({ active, currentStepIndex, waitingOnApi }) {
  if (!active) return null;

  const progressPct = Math.min(
    98,
    ((currentStepIndex + 1) / PROCESSING_STEPS.length) * 80 + (waitingOnApi ? 18 : 0)
  );

  return (
    <div className="mfg-overlay" role="status" aria-live="polite">
      <div className="mfg-panel">
        <div className="mfg-brand">
          <span className="mfg-brand-mark">MFG</span>
          <span className="mfg-brand-sub">Pro+ · Document pipeline</span>
        </div>
        <div className="mfg-progress-outer">
          <div className="mfg-progress-inner" style={{ width: `${progressPct}%` }} />
        </div>
        <ul className="mfg-steps">
          {PROCESSING_STEPS.map((s, i) => (
            <li
              key={s.id}
              className={`mfg-step ${i < currentStepIndex ? 'done' : ''} ${i === currentStepIndex ? 'active' : ''}`}
            >
              <span className="mfg-step-dot">{i < currentStepIndex ? '✓' : i === currentStepIndex ? '●' : '○'}</span>
              {s.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
