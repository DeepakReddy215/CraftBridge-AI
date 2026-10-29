import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import type { HealthCheckResponse } from '../types/api';

export function useServerAwake() {
  const [isWaking, setIsWaking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [wakeProgress, setWakeProgress] = useState(0);
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    let timer: any = null;
    let progressTimer: any = null;

    const checkServer = async () => {
      // If server does not reply within 3s, show waking banner
      timer = setTimeout(() => {
        if (!cancelled && !isReady) {
          setIsWaking(true);
        }
      }, 3000);

      const maxWait = 90000; // 90 seconds
      startTimeRef.current = Date.now();

      progressTimer = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const pct = Math.min(96, Math.round((elapsed / 60000) * 100));
        setWakeProgress(pct);
      }, 1000);

      while (!cancelled && (Date.now() - startTimeRef.current) < maxWait) {
        try {
          const health = await api.getHealth();
          if (health && !cancelled) {
            setHealthData(health);
            setIsReady(true);
            setIsWaking(false);
            setWakeProgress(100);
            if (timer) clearTimeout(timer);
            if (progressTimer) clearInterval(progressTimer);
            return;
          }
        } catch {
          // retry after delay with backoff
          await new Promise(r => setTimeout(r, 4000));
        }
      }

      // If timed out, fallback to local demo mode seamlessly
      if (!cancelled) {
        setIsWaking(false);
        setIsReady(true);
      }
    };

    checkServer();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, []);

  return { isWaking, isReady, wakeProgress, healthData };
}
