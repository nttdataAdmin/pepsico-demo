import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatAssistant } from '../../context/ChatAssistantContext';

const ROUTE_TITLES = {
  '/upload': 'Form upload',
  '/executive-summary': 'Executive summary',
  '/anomalies': 'Anomalies',
  '/root-cause': 'Root cause analysis',
  '/recommendations': 'Recommendations',
  '/maintenance': 'Maintenance schedule',
  '/': 'Home',
};

/** Keeps assistant route in sync with React Router (place inside Router). */
export function ChatRouteSync() {
  const loc = useLocation();
  const { setRoutePath, setPageTitle } = useChatAssistant();

  useEffect(() => {
    setRoutePath(loc.pathname);
    setPageTitle(ROUTE_TITLES[loc.pathname] || 'Dashboard');
  }, [loc.pathname, setRoutePath, setPageTitle]);

  return null;
}

/** Pushes global filters/month/year into assistant API ui_context. */
export function ChatUiSync({ selectedMonth, selectedYear, filters }) {
  const { setUiContext } = useChatAssistant();

  useEffect(() => {
    setUiContext({ selectedMonth, selectedYear, filters });
    return () => setUiContext(null);
  }, [selectedMonth, selectedYear, filters, setUiContext]);

  return null;
}
