import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classifyForm } from '../../services/api';
import { useAppFlow } from '../../context/AppFlowContext';
import FormProcessingOverlay, { PROCESSING_STEPS } from './FormProcessingOverlay';
import GoSuccessModal from './GoSuccessModal';
import './FormUpload.css';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function FormUpload({ onLogout }) {
  const navigate = useNavigate();
  const { setFlow, loadExcel, clearFlow, flow } = useAppFlow();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [procStep, setProcStep] = useState(0);
  const [waitingApi, setWaitingApi] = useState(false);
  const [goModalOpen, setGoModalOpen] = useState(false);

  useEffect(() => {
    if (flow.outcome === 'go' && !flow.fullDashboard) {
      setGoModalOpen(true);
    }
  }, [flow.outcome, flow.fullDashboard]);

  const runPipeline = useCallback(
    async (file, clientHint) => {
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
        setFlow({
          outcome: isNoGo ? 'no_go' : 'go',
          fullDashboard: isNoGo,
        });
        await loadExcel(true);

        if (isNoGo) {
          navigate('/executive-summary', { replace: true });
        } else {
          setGoModalOpen(true);
        }
      } catch (e) {
        setWaitingApi(false);
        setProcessing(false);
        setErr(e.message || 'Upload failed');
      } finally {
        setBusy(false);
      }
    },
    [loadExcel, navigate, setFlow]
  );

  const handleLogoutFromModal = () => {
    setGoModalOpen(false);
    clearFlow();
    if (onLogout) onLogout();
  };

  const handleUploadAnother = () => {
    setGoModalOpen(false);
    setFlow((f) => ({ ...f, outcome: null, fullDashboard: false }));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) runPipeline(f, null);
    e.target.value = '';
  };

  return (
    <div className="form-upload-page">
      <FormProcessingOverlay active={processing} currentStepIndex={procStep} waitingOnApi={waitingApi} />
      <GoSuccessModal
        open={goModalOpen}
        onLogout={handleLogoutFromModal}
        onUploadAnother={handleUploadAnother}
      />

      <div className="form-upload-card">
        <h1 className="form-upload-title">Package quality form</h1>
        <p className="form-upload-lead">
          Upload a completed JOB AID (FL-5883 style). After upload you will see an <strong>MFG Pro+</strong> style
          scheduler animation, then we <strong>extract text</strong> and <strong>classify</strong> as{' '}
          <strong>Go</strong> or <strong>No-Go</strong>. <strong>Go</strong> shows confirmation and log out;{' '}
          <strong>No-Go</strong> opens Executive Summary → Anomalies → RCA → Recommendations → Planned Downtime.
        </p>

        <label className="form-upload-drop">
          <input type="file" accept="image/*,.pdf,.svg" disabled={busy} onChange={onFile} />
          <span>{busy ? 'Processing…' : 'Choose file or drop here'}</span>
        </label>

        {err && <div className="form-upload-error">{err}</div>}
      </div>
    </div>
  );
}
