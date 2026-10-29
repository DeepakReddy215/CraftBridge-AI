import React from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { useServerAwake } from '../../hooks/useServerAwake';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface PageShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  hideNav = false,
  hideFooter = false,
}) => {
  const { isWaking, wakeProgress } = useServerAwake();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-tx bg-grid-pattern relative selection:bg-clay selection:text-white">
      {/* Cold start / Render free web service waking banner */}
      {isWaking && (
        <aside
          role="status"
          aria-label="Server waking notice"
          className="bg-clay/90 text-white px-4 py-2 text-xs flex items-center justify-between shadow-lg sticky top-0 z-50 animate-in fade-in duration-300"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>
                <strong>Waking free-tier Render server...</strong> Spin-up takes ~60-90s on cold boot. Cached demo data is active.
              </span>
            </div>
            <div className="w-32 bg-white/30 rounded-full h-2 overflow-hidden shrink-0">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${wakeProgress}%` }}
              />
            </div>
          </div>
        </aside>
      )}

      {!hideNav && <Nav />}

      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};
