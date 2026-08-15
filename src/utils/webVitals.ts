type VitalName = 'CLS' | 'INP' | 'LCP' | 'TTFB';

const endpoint = '/api/telemetry/web-vitals';
const values = new Map<VitalName, number>();

const send = (name: VitalName, value: number) => {
  if (!Number.isFinite(value) || value < 0) return;
  const payload = JSON.stringify({
    name,
    value: Number(value.toFixed(name === 'CLS' ? 4 : 1)),
    path: window.location.pathname.slice(0, 200),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
  } else {
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true })
      .catch(() => undefined);
  }
};

export const startWebVitalsMonitoring = () => {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (navigation) send('TTFB', navigation.responseStart);

  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) values.set('LCP', last.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch { /* Metric unsupported by this browser. */ }

  try {
    let cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
        if (!entry.hadRecentInput) cls += entry.value || 0;
      }
      values.set('CLS', cls);
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* Metric unsupported by this browser. */ }

  try {
    let longestInteraction = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) longestInteraction = Math.max(longestInteraction, entry.duration);
      values.set('INP', longestInteraction);
    }).observe({ type: 'event', buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
  } catch { /* Metric unsupported by this browser. */ }

  const flush = () => {
    for (const [name, value] of values) send(name, value);
    values.clear();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush, { once: true });
};
