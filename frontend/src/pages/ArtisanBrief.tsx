import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { BriefCard } from '../components/artisan/BriefCard';
import { GuidanceSteps } from '../components/artisan/GuidanceSteps';
import { Button } from '../components/ui/Button';
import { useSingleRequest } from '../hooks/useRequest';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';

export const ArtisanBrief: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { request, loading } = useSingleRequest(id);

  if (loading || !request || !request.brief) {
    return (
      <PageShell>
        <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm text-mu">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-clay" />
          <span>Loading Brief & Workshop Milestones...</span>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-cardBorder">
          <Link
            to="/artisan"
            className="text-xs font-mono text-mu hover:text-tx inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workshop Queue
          </Link>
          <Link to={`/artisan/requests/${id}/upload`}>
            <Button size="sm" variant="secondary" rightIcon={<Camera className="w-3.5 h-3.5" />}>
              Proceed to A3 Photo Upload
            </Button>
          </Link>
        </div>

        {/* A1 Brief Card */}
        <BriefCard brief={request.brief} />

        {/* A2 Guidance Steps */}
        <GuidanceSteps
          stages={request.brief.guidance_json.stages}
          checklist={request.brief.guidance_json.quality_checklist}
        />
      </div>
    </PageShell>
  );
};
