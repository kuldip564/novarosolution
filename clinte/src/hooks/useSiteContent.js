import { useEffect, useState } from 'react';
import { fetchSiteContent } from '../config/api';

const initialState = {
  data: {},
  loading: true,
  error: '',
};

export default function useSiteContent() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let isMounted = true;
    let retryTimer;
    let retryCount = 0;
    const maxRetries = 1;

    async function loadContent() {
      try {
        const data = await fetchSiteContent();
        if (!isMounted) return;
        retryCount = 0;
        setState({
          data,
          loading: false,
          error: '',
        });
      } catch (error) {
        if (!isMounted) return;
        const message = error?.message || 'Unable to load site content.';
        const isNetworkIssue =
          message.includes('Backend is not reachable') ||
          message.includes('Request timed out');

        if (isNetworkIssue && retryCount < maxRetries) {
          retryCount += 1;
          setState((prev) => ({
            data: prev.data || {},
            loading: false,
            error: message,
          }));
          retryTimer = setTimeout(() => {
            loadContent();
          }, 1500);
          return;
        }

        setState({
          data: {},
          loading: false,
          error: message,
        });
      }
    }

    loadContent();
    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  return state;
}

