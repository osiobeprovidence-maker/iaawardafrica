import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { triggerTopProgress } from '../components/common/TopProgressBar';
import { Nominee } from '../types';
import { Award, Crown, Flame, Vote, TrendingUp, ShieldCheck } from 'lucide-react';

interface LeaderboardPageProps {
  onOpenVoteModal: (nominee?: Nominee) => void;
  onViewNomineeProfile: (nominee: Nominee) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  onOpenVoteModal,
  onViewNomineeProfile
}) => {
  const { categories, nominees, votingSettings } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');

  const activeCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];
  const categoryNominees = nominees
    .filter(n => n.categoryId === activeCategory?.id)
    .sort((a, b) => b.votesCount - a.votesCount);

  const totalCategoryVotes = categoryNominees.reduce((sum, n) => sum + n.votesCount, 0) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
            <TrendingUp className="w-3.5 h-3.5 text-[#F2A01F]" />
            <span>Live Audited Ballot Ledger</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
            Official Continental Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl font-light">
            Rankings reflect verified payments processed through official gateways. Real-time updates occur within seconds of server webhook confirmation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white border border-neutral-200 px-3 py-2 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Ballots verified by independent auditing commission</span>
        </div>
      </div>

      {/* Category selector pills (functional tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => {
          const isSelected = cat.id === activeCategory?.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerTopProgress(180);
                setSelectedCategoryId(cat.id);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#0B0B0B] text-white shadow'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Category Info Header */}
      <div className="bg-[#0B0B0B] text-white p-6 rounded-xl border border-[#C9971C]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#F2A01F]">
            Category: {activeCategory?.code}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
            {activeCategory?.name}
          </h2>
          <p className="text-xs text-white/70 max-w-xl mt-1 font-light">
            {activeCategory?.description}
          </p>
        </div>

        {votingSettings.showPublicVoteCounts && (
          <div className="text-left md:text-right shrink-0 bg-white/5 p-3 rounded-lg border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-white/50 block">Total Category Votes</span>
            <span className="font-mono text-xl font-bold text-[#FAF8F4] tabular-nums">
              {totalCategoryVotes.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Ranked List */}
      <div className="space-y-3">
        {categoryNominees.map((nominee, index) => {
          const rank = index + 1;
          const votePercentage = Math.round((nominee.votesCount / totalCategoryVotes) * 100);

          // Medal styling
          let rankBadge = (
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-sm font-mono">
              #{rank}
            </div>
          );
          if (rank === 1) {
            rankBadge = (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F2A01F] to-[#C9971C] text-[#0B0B0B] flex items-center justify-center font-bold shadow-md ring-2 ring-[#F2A01F]/40">
                <Crown className="w-5 h-5 text-black" />
              </div>
            );
          } else if (rank === 2) {
            rankBadge = (
              <div className="w-8 h-8 rounded-full bg-neutral-300 text-neutral-900 flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                2nd
              </div>
            );
          } else if (rank === 3) {
            rankBadge = (
              <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-900 border border-amber-800/30 flex items-center justify-center font-bold text-xs font-mono">
                3rd
              </div>
            );
          }

          return (
            <div
              key={nominee.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                rank === 1 ? 'border-[#C9971C]/70 shadow-md ring-1 ring-[#C9971C]/20' : 'border-neutral-200'
              }`}
            >
              {/* Left Zone: Rank & Avatar & Info */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="shrink-0">{rankBadge}</div>

                <img
                  src={nominee.photoUrl}
                  alt={nominee.name}
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-[#0B0B0B] truncate">
                      {nominee.stageName || nominee.name}
                    </h3>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                      · {nominee.country}
                    </span>
                  </div>
                  {nominee.stageName && (
                    <span className="text-xs text-neutral-500 block truncate">
                      {nominee.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Zone: Share Progress Bar */}
              <div className="w-full sm:w-48 lg:w-64 space-y-1">
                {votingSettings.showPublicVoteCounts ? (
                  <>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-500">{votePercentage}% share</span>
                      <span className="font-mono text-[#0B0B0B] tabular-nums">
                        {nominee.votesCount.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${rank === 1 ? 'bg-[#E8471C]' : 'bg-[#C9971C]'}`}
                        style={{ width: `${Math.max(4, votePercentage)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-neutral-600">
                      Rank #{rank} in Ballot
                    </span>
                  </div>
                )}
              </div>

              {/* Right Zone: Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onViewNomineeProfile(nominee)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-medium"
                >
                  Bio
                </button>
                <button
                  type="button"
                  onClick={() => onOpenVoteModal(nominee)}
                  className="px-4 py-2 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs font-bold uppercase rounded-md shadow transition-all flex items-center gap-1.5"
                >
                  <Vote className="w-3.5 h-3.5" />
                  Vote
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
