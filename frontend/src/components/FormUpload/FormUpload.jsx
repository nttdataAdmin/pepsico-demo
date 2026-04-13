import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { classifyForm } from '../../services/api';
import { useAppFlow } from '../../context/AppFlowContext';
import { operatorRoleTitle } from '../../utils/operatorRole';
import FormProcessingOverlay, { PROCESSING_STEPS } from './FormProcessingOverlay';
import './FormUpload.css';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function FormUpload({ onLogout }) {
  const navigate = useNavigate();
  const { flow, setFlow, loadExcel } = useAppFlow();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [procStep, setProcStep] = useState(0);
  const [waitingApi, setWaitingApi] = useState(false);

  const runPipeline = useCallback(
    async (file, clientHint) => {
      const operatorRole = flow.operatorRole;
      if (!operatorRole) {
        setErr('Your account is missing a line lens. Sign out and sign in with a demo line or supervisor account.');
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
          setFlow((prev) => ({
            ...prev,
            outcome: 'no_go',
            operatorRole,
            hitlApproved: false,
            detailedAnalysisUnlocked: false,
          }));
          navigate('/executive-summary', { replace: true });
        } else {
          setFlow((prev) => ({
            ...prev,
            outcome: 'go',
            operatorRole,
            hitlApproved: false,
            detailedAnalysisUnlocked: false,
          }));
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
    [flow.operatorRole, loadExcel, navigate, setFlow]
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
          Your <strong>processing vs packaging lens</strong> is set from login (master user table). Upload a JOB AID
          (FL-5883 style); the demo classifies <strong>Go</strong> vs <strong>No-Go</strong>. <strong>Go</strong> opens a
          lightweight executive snapshot. <strong>No-Go</strong> requires <strong>supervisor HITL</strong>, then a
          recommendations popup; use <strong>Enter detailed analysis</strong> on Executive summary to unlock the full
          five-tab workspace.
        </p>

        {flow.operatorRole ? (
          <p className="form-upload-lens-note" role="status">
            Signed-in lens: <strong>{operatorRoleTitle(flow.operatorRole)}</strong>
          </p>
        ) : null}

        <label className="form-upload-drop">
          <input type="file" accept="image/*,.pdf,.svg" disabled={busy} onChange={onFile} />
          <span>{busy ? 'Processing…' : 'Choose file or drop here'}</span>
        </label>

        {err && <div className="form-upload-error">{err}</div>}
      </div>
    </div>
  );
}
