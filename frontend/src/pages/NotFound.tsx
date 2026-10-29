import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GlowCard } from '../components/ui/GlowCard';
import { Button } from '../components/ui/Button';
import { Home, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <PageShell>
      <div className="flex-1 flex items-center justify-center p-4 py-24">
        <GlowCard className="max-w-md w-full p-8 text-center" glowColor="clay">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-cardBorder mx-auto flex items-center justify-center text-clay mb-4">
            <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="text-xs font-mono text-clay font-bold uppercase tracking-wider">Error 404</span>
          <h2 className="text-2xl font-bold text-tx mt-1 mb-2">Vessel Not Found</h2>
          <p className="text-xs text-mu mb-6 leading-relaxed">
            The requested studio coordinate does not exist or has been relocated to another shelf in our atelier.
          </p>
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Return to Atelier Gallery
            </Button>
          </Link>
        </GlowCard>
      </div>
    </PageShell>
  );
};
