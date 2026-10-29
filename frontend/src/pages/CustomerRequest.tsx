import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { RequestForm } from '../components/customer/RequestForm';
import { StatusTimeline } from '../components/customer/StatusTimeline';
import { PreviewPanel } from '../components/customer/PreviewPanel';
import { FeedbackBox } from '../components/customer/FeedbackBox';
import { BriefCard } from '../components/artisan/BriefCard';
import { useSingleRequest } from '../hooks/useRequest';
import { api, mockAnalysisResult } from '../lib/api';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import type { CraftRequest } from '../types/api';

export const CustomerRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const { request, loading, refetch } = useSingleRequest(isNew ? undefined : id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRequest = async (data: Partial<CraftRequest>) => {
    setIsSubmitting(true);
    try {
      const created = await api.createRequest(data);
      navigate(`/customer/requests/${created.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!id) return;
    await api.approveRequest(id);
    refetch();
  };

  const handleFeedback = async (comment: string) => {
    if (!id) return;
    await api.submitFeedback(id, comment);
    refetch();
  };

  if (isNew) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-6">
          <Link
            to="/customer"
            className="text-xs font-mono text-mu hover:text-tx inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="border-b border-cardBorder pb-4">
            <h1 className="text-2xl font-bold text-tx">Commission Bespoke Handcrafted Pottery</h1>
            <p className="text-xs text-mu mt-1">
              Specify your aesthetic profile, silhouette, and budget. Our AI Gateway will synthesize a detailed studio brief.
            </p>
          </div>
          <RequestForm onSubmit={handleCreateRequest} isLoading={isSubmitting} />
        </div>
      </PageShell>
    );
  }

  if (loading || !request) {
    return (
      <PageShell>
        <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm text-mu">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-clay" />
          <span>Loading Commission #{id}...</span>
        </div>
      </PageShell>
    );
  }

  // Get or simulate analysis result for preview
  const analysisData = mockAnalysisResult(request.id);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-cardBorder">
          <Link
            to="/customer"
            className="text-xs font-mono text-mu hover:text-tx inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Commissions
          </Link>
          <div className="text-xs font-mono text-mu">
            Status: <span className="text-clay font-bold">{request.status}</span>
          </div>
        </div>

        {/* C2 Status Timeline */}
        <StatusTimeline request={request} />

        {/* Generated Brief Display if available */}
        {request.brief && (
          <div className="space-y-2">
            <BriefCard brief={request.brief} />
          </div>
        )}

        {/* C3 Finished Piece Preview & Quality Analysis (when ANALYSED, PREVIEWED, or APPROVED) */}
        {(request.status === 'ANALYSED' ||
          request.status === 'PREVIEWED' ||
          request.status === 'APPROVED' ||
          request.status === 'REVISION_REQUESTED') && (
          <div className="space-y-6 pt-4 border-t border-cardBorder">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-clay" />
              <h2 className="text-lg font-bold text-tx">C3 Inspection & Intent Review</h2>
            </div>

            <PreviewPanel analysis={analysisData} />

            {/* Feedback / Approval Box */}
            <FeedbackBox
              isApproved={request.status === 'APPROVED'}
              onApprove={handleApprove}
              onSubmitFeedback={handleFeedback}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
};
