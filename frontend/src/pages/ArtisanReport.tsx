import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { ReportView } from '../components/artisan/ReportView';
import { useSingleRequest } from '../hooks/useRequest';
import { mockAnalysisResult } from '../lib/api';
import { ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ArtisanReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { request, loading } = useSingleRequest(id);

  if (loading || !request) {
    return (
      <PageShell>
        <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm text-mu">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-clay" />
          <span>Compiling A4 Studio Diagnostic Report...</span>
        </div>
      </PageShell>
    );
  }

  const analysis = mockAnalysisResult(request.id);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cardBorder">
          <div>
            <Link
              to="/artisan"
              className="text-xs font-mono text-mu hover:text-tx inline-flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Workshop Queue
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-clay" />
              <h1 className="text-2xl font-bold text-tx">A4 Certified Studio Diagnostic Report</h1>
            </div>
            <span className="text-xs font-mono text-mu">
              Vessel: {request.product} • Piece ID: #{request.id}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/customer/requests/${id}`}>
              <Button size="sm" variant="outline">
                Preview Customer View
              </Button>
            </Link>
          </div>
        </div>

        {/* A4 Report View */}
        <ReportView analysis={analysis} />
      </div>
    </PageShell>
  );
};
