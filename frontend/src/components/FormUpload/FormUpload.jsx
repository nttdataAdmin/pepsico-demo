import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { classifyForm } from '../../services/api';
import { useAppFlow } from '../../context/AppFlowContext';
import FormProcessingOverlay, { PROCESSING_STEPS } from './FormProcessingOverlay';
import { OPERATOR_ROLES } from '../../utils/operatorRole';
import './FormUpload.css';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function FormUpload({ onLogout }) {
  const navigate = useNavigate();
  const { setFlow, loadExcel } = useAppFlow();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [procStep, setProcStep] = useState(0);
  const [waitingApi, setWaitingApi] = useState(false);
  const [operatorRole, setOperatorRole] = useState(OPERATOR_ROLES.processing);

  const runPipeline = useCallback(
    async (file, clientHint) => {
      if (!operatorRole) {
        setErr('Select your operator role (processing or packaging) before uploading.');
        return;
      }
      setErr(null);
      setBusy(true);
      setProcessing(true);
      setWaitingApi(false);
      setProcStep(0);

      const apiPromise = classifyForm(file, clientHint);

      try {
        for (let s = 0; s < PROCESSING_STEPS.length; s++) {
          setProcStep(s);
          await sleep(780);
        }
        setWaitingApi(true);
        const res = await apiPromise;
        setWaitingApi(false);
        setProcessing(false);

        const isNoGo = res.classification === 'no_go';
        await loadExcel(true);

        if (isNoGo) {
          setFlow({
            outcome: 'no_go',
            operatorRole,
            hitlApproved: false,
          });
          navigate('/executive-summary', { replace: true });
        } else {
          setFlow({
            outcome: 'go',
            operatorRole,
            hitlApproved: false,
          });
          navigate('/executive-summary', { replace: true });
        }
      } catch (e) {
        setWaitingApi(false);
        setProcessing(false);
        setErr(e.message || 'Upload failed');
      } finally {
        setBusy(false);
      }
    },
    [loadExcel, navigate, operatorRole, setFlow]
  );

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) runPipeline(f, null);
    e.target.value = '';
  };

  return (
    <div className="form-upload-page">
      <FormProcessingOverlay active={processing} currentStepIndex={procStep} waitingOnApi={waitingApi} />

      <div className="form-upload-card">
        <h1 className="form-upload-title">Package quality form</h1>
        <p className="form-upload-lead">
          Choose your <strong>line operator lens</strong>, then upload a JOB AID (FL-5883 style). The demo classifies{' '}
          <strong>Go</strong> vs <strong>No-Go</strong>. <strong>Go</strong> opens Executive summary for a healthy-line
          snapshot with an option to upload another form. <strong>No-Go</strong> requires{' '}
          <strong>supervisor approval (HITL)</strong> on Executive summary before Anomalies → RCA → Recommendations →
          Planned downtime unlock — closing the gap vs MFG Pro for packaging vs processing perspectives.
        </p>

        <div className="form-upload-role" role="group" aria-label="Operator role">
          <span className="form-upload-role-label">Operator role</span>
          <div className="form-upload-role-toggle">
            <button
              type="button"
              className={`form-upload-role-btn ${operatorRole === OPERATOR_ROLES.processing ? 'active' : ''}`}
              onClick={() => setOperatorRole(OPERATOR_ROLES.processing)}
              disabled={busy}
            >
              <span className="form-upload-role-title">Processing line</span>
              <span className="form-upload-role-desc">Fryer, slicer, seasoning, upstream thermal</span>
            </button>
            <button
              type="button"
              className={`form-upload-role-btn ${operatorRole === OPERATOR_ROLES.packaging ? 'active' : ''}`}
              onClick={() => setOperatorRole(OPERATOR_ROLES.packaging)}
              disabled={busy}
            >
              <span className="form-upload-role-title">Packaging line</span>
              <span className="form-upload-role-desc">Palletizer, case sealer, conveyors, WMS handoff</span>
            </button>
          </div>
        </div>

        <label className="form-upload-drop">
          <input type="file" accept="image/*,.pdf,.svg" disabled={busy} onChange={onFile} />
          <span>{busy ? 'Processing…' : 'Choose file or drop here'}</span>
        </label>

        {err && <div className="form-upload-error">{err}</div>}
      </div>
    </div>
  );
}
