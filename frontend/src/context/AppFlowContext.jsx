import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { getSuperExcel } from '../services/api';

const STORAGE_KEY = 'pepsico_flow';
const EXCEL_CACHE_KEY = 'pepsico_excel_cache';

function readFlow() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { outcome: null, fullDashboard: false };
    const o = JSON.parse(raw);
    return {
      outcome: o.outcome ?? null,
      fullDashboard: !!o.fullDashboard,
    };
  } catch {
    return { outcome: null, fullDashboard: false };
  }
}

function writeFlow(flow) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
}

const AppFlowContext = createContext(null);

export function AppFlowProvider({ children }) {
  const [flow, setFlowState] = useState(readFlow);
  const [excelBundle, setExcelBundle] = useState(null);
  const [excelError, setExcelError] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);

  const setFlow = useCallback((next) => {
    setFlowState((prev) => {
      const merged = typeof next === 'function' ? next(prev) : { ...prev, ...next };
      writeFlow(merged);
      return merged;
    });
  }, []);

  const clearFlow = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(EXCEL_CACHE_KEY);
    setFlowState({ outcome: null, fullDashboard: false });
  }, []);

  const loadExcel = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = sessionStorage.getItem(EXCEL_CACHE_KEY);
        if (cached) {
          setExcelBundle(JSON.parse(cached));
          return;
        }
      } catch {
        /* ignore */
      }
    }
    setExcelLoading(true);
    setExcelError(null);
    try {
      const data = await getSuperExcel();
      setExcelBundle(data);
      sessionStorage.setItem(EXCEL_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      setExcelError(e.message || 'Failed to load operational data bundle');
      setExcelBundle(null);
    } finally {
      setExcelLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExcel(false);
  }, [loadExcel]);

  const showNavBar = flow.outcome === 'no_go' || flow.fullDashboard;

  const value = useMemo(
    () => ({
      flow,
      setFlow,
      clearFlow,
      excelBundle,
      excelError,
      excelLoading,
      loadExcel,
      showNavBar,
    }),
    [flow, setFlow, clearFlow, excelBundle, excelError, excelLoading, loadExcel, showNavBar]
  );

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>;
}

export function useAppFlow() {
  const ctx = useContext(AppFlowContext);
  if (!ctx) throw new Error('useAppFlow must be used within AppFlowProvider');
  return ctx;
}
