import { useCallback, useEffect, useState } from 'react';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Two routes is not worth a router dependency. Pages serves this as a static
 * site, so 404.html is copied from index.html at build time to make deep links
 * survive a hard refresh.
 */
export function usePath(): [string, (to: string) => void] {
  const [path, setPath] = useState(() => strip(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(strip(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', `${BASE}${to}`);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  return [path, navigate];
}

const strip = (pathname: string) => pathname.slice(BASE.length) || '/';
