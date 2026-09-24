import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Flame, ShieldAlert, Vote, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Nominee } from '../../types';

interface VotingCountdownBannerProps {
  onOpenVoteModal: (nominee?: Nominee) => void;
  onNavigateLeaderboard?: () => void;
  onNavigateNominees?: () => void;
}

export const VotingCountdownBanner: React.FC<VotingCountdownBannerProps> = ({
  onOpenVoteModal,
  onNavigateLeaderboard,
  onNavigateNominees
}) => {
  const { votingSettings, transactions, nominees } = useApp();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isUrgent: boolean;
    isClosed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUrgent: false,
    isClosed: false
  });

  const totalVerifiedVotes = transactions
    .filter(t => t.status === 'verified')
    .reduce((sum, t) => sum + t.votesCount, 0);

  useEffect(() => {
    const calculateTime = () => {
      const endTime = new Date(votingSettings.votingEndTime).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0 || !votingSettings.votingOpen) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isUrgent: false,
          isClosed: true
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Urgent if less than 7 days left
      const isUrgent = days < 7;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isUrgent,
        isClosed: false
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [votingSettings.votingEndTime, votingSettings.votingOpen]);

  // Formatted end date string
  const formattedEndDate = new Date(votingSettings.votingEndTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, highlight: timeLeft.days === 0 },
    { label: 'Hours', value: timeLeft.hours, highlight: timeLeft.days === 0 && timeLeft.hours < 12 },
    { label: 'Minutes', value: timeLeft.minutes, highlight: false },
    { label: 'Seconds', value: timeLeft.seconds, highlight: true }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#141414] via-[#0B0B0B] to-[#120804] border-2 border-[#C9971C]/50 shadow-2xl p-6 sm:p-8 text-white">
      {/* Background African Kente & Glow Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8471C]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9971C]/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />
      
      {/* Top Banner Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9971C] via-[#E8471C] to-[#F2A01F]" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Urgency Information */}
        <div className="space-y-3.5 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8471C]/20 border border-[#E8471C]/50 text-xs font-bold text-[#FAF8F4]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8471C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8471C]"></span>
            </span>
            <span className="uppercase tracking-widest text-[#F2A01F] text-[11px] font-extrabold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#E8471C]" />
              {timeLeft.isClosed ? 'Ballot Windows Closed' : 'Official Public Voting Deadline'}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            {timeLeft.isClosed ? (
              <span className="text-neutral-300">Polls are Officially Sealed & Under Audit</span>
            ) : (
              <>
                Voting Closes in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2A01F] via-[#C9971C] to-[#E8471C]">
                  {timeLeft.days} Days
                </span>
                !
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            {timeLeft.isClosed ? (
              'All votes have been locked into the cryptographic auditor vault for final verification by the IAA Independent Academy.'
            ) : (
              `Every vote cast directly decides who takes home the coveted 24k Gold Trophy at the 7th Edition Gala. Polls permanently close on ${formattedEndDate}.`
            )}
          </p>

          {/* Social Proof & Ledger Counter */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-lg border border-white/10">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-bold">{totalVerifiedVotes.toLocaleString()}</span>
              <span>votes counted</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-lg border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#C9971C]" />
              <span className="text-white font-bold">{nominees.length}</span>
              <span>icons across 14 categories</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Countdown Clock Box & Immediate CTAs */}
        <div className="flex flex-col items-center lg:items-end gap-5 w-full lg:w-auto">
          {timeLeft.isClosed ? (
            <div className="bg-black/60 border border-neutral-700 rounded-2xl p-6 text-center">
              <ShieldAlert className="w-10 h-10 text-[#C9971C] mx-auto mb-2" />
              <span className="font-serif font-bold text-lg text-white block">Voting Window Sealed</span>
              <span className="text-xs text-neutral-400 block mt-1">Audit process in progress</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {timeUnits.map((unit, i) => (
                <React.Fragment key={unit.label}>
                  <div className="flex flex-col items-center">
                    <div className="relative bg-gradient-to-b from-neutral-900 to-[#0B0B0B] border-2 border-[#C9971C]/50 rounded-xl px-2.5 sm:px-4 py-3 min-w-[64px] sm:min-w-[78px] text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group hover:border-[#F2A01F] transition-all">
                      {/* Sub-counter glare */}
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-white/5 rounded-t-lg pointer-events-none" />
                      
                      <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FAF8F4] tracking-tight block">
                        {String(unit.value).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#F2A01F] mt-1 block">
                        {unit.label}
                      </span>
                    </div>
                  </div>
                  {i < timeUnits.length - 1 && (
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#C9971C] -mt-4 animate-pulse">
                      :
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {!timeLeft.isClosed && (
              <button
                type="button"
                onClick={() => onOpenVoteModal()}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#E8471C] to-[#d63a10] hover:from-[#f05026] hover:to-[#e8471c] active:scale-95 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Vote className="w-4 h-4" />
                <span>Cast Your Vote Now</span>
              </button>
            )}

            {onNavigateLeaderboard && (
              <button
                type="button"
                onClick={onNavigateLeaderboard}
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#F2A01F]" />
                <span>Live Leaderboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
