import React, { useState } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { CheckCircle2, MessageSquare, Send, Sparkles } from 'lucide-react';

function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number }> = [];
  const colors = ['#e4793f', '#4fd1c5', '#fbbf24', '#4ade80'];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 4,
    });
  }

  let frame = 0;
  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (frame < 90) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  }
  animate();
}

export interface FeedbackBoxProps {
  onApprove: () => Promise<void>;
  onSubmitFeedback: (comment: string) => Promise<void>;
  isApproved?: boolean;
}

export const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  onApprove,
  onSubmitFeedback,
  isApproved = false,
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove();
      triggerConfetti();
    } finally {
      setIsApproving(false);
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmitFeedback(comment.trim());
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApproved) {
    return (
      <GlowCard className="p-8 text-center bg-emerald-950/20 border-emerald-500/30" glowColor="teal">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-tx">Craft Certified & Approved</h3>
        <p className="text-xs text-mu max-w-md mx-auto mt-2 leading-relaxed">
          You approved this commissioned piece. The artisan has received dispatch authorization and will safely package your ceramic artwork.
        </p>
      </GlowCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      {/* Revision Request Form */}
      <div className="md:col-span-7">
        <GlowCard className="p-6 h-full flex flex-col justify-between" glowColor="clay">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-clay" />
              <h4 className="text-sm font-bold text-tx">Request Polish or Revision</h4>
            </div>
            <p className="text-xs text-mu mb-4">
              Need minor tweaks on glaze finish, rim buffing, or packaging details? The artisan receives structured guidance to address your notes.
            </p>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Please buff the glaze gloss on the left shoulder and verify base stability..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg2 border border-cardBorder text-tx text-xs focus:ring-2 focus:ring-clay/50 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!comment.trim() || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleFeedback}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Revision Note
            </Button>
          </div>
        </GlowCard>
      </div>

      {/* 1-Click Approve Card */}
      <div className="md:col-span-5">
        <GlowCard className="p-6 h-full flex flex-col justify-between bg-emerald-950/10 border-emerald-500/20" glowColor="teal">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-tx">Ready to Certify?</h4>
            </div>
            <p className="text-xs text-mu mb-4 leading-relaxed">
              Happy with the craftsmanship and quality score? Approving confirms the fair price and authorizes final packaging & courier dispatch.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            isLoading={isApproving}
            onClick={handleApprove}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Approve & Certify Piece
          </Button>
        </GlowCard>
      </div>
    </div>
  );
};
