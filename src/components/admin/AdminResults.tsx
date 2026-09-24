import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Crown, AlertTriangle, ShieldCheck, CheckCircle2, Lock, Send } from 'lucide-react';

export const AdminResults: React.FC = () => {
  const { categories, nominees, votingSettings, updateVotingSettings } = useApp();
  const [published, setPublished] = useState(false);

  // Group nominees by category and find top
  const categoryResults = categories.map(cat => {
    const list = nominees
      .filter(n => n.categoryId === cat.id)
      .sort((a, b) => b.votesCount - a.votesCount);
    const winner = list[0];
    const runnerUp = list[1];
    const totalVotes = list.reduce((sum, n) => sum + n.votesCount, 0);
    const leadMargin = winner && runnerUp ? winner.votesCount - runnerUp.votesCount : winner?.votesCount || 0;
    const suspicious = totalVotes > 5000 && leadMargin < 20; // Example fraud audit heuristic

    return {
      category: cat,
      nominees: list,
      winner,
      runnerUp,
      totalVotes,
      leadMargin,
      suspicious
    };
  });

  const handlePublishResults = () => {
    if (confirm('Official Results Publication will freeze the ballot and declare category winners on the public portal. Proceed?')) {
      updateVotingSettings({ votingOpen: false });
      setPublished(true);
      setTimeout(() => setPublished(false), 5000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Ballot Audit & Results Certification</h3>
          <p className="text-xs text-neutral-500">Examine live tallies, detect anomalies, certify category laureates, and publish final outcomes.</p>
        </div>

        <button
          type="button"
          onClick={handlePublishResults}
          className="px-4 py-2.5 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Award className="w-4 h-4" />
          Publish Certified Winners
        </button>
      </div>

      {published && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Official 7th Edition Category Laureates have been certified and published to the public portal!</span>
        </div>
      )}

      {/* Categories Results Cards */}
      <div className="space-y-6">
        {categoryResults.map(({ category, nominees: list, winner, runnerUp, totalVotes, leadMargin, suspicious }) => (
          <div key={category.id} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#E8471C] tracking-wider">
                  {category.code}
                </span>
                <h4 className="font-serif font-bold text-lg text-[#0B0B0B]">
                  {category.name}
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-neutral-500">
                  Total Category Votes: <strong className="text-neutral-900 font-mono">{totalVotes.toLocaleString()}</strong>
                </span>
                {suspicious && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px] uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Tight Margin Flag
                  </span>
                )}
              </div>
            </div>

            {/* Winner Spotlight */}
            {winner ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F2A01F] to-[#C9971C] text-black flex items-center justify-center shrink-0 shadow">
                    <Crown className="w-5 h-5" />
                  </div>
                  <img
                    src={winner.photoUrl}
                    alt={winner.name}
                    className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#C9971C] uppercase tracking-wider block">
                      Projected Laureate (1st Place)
                    </span>
                    <h5 className="font-serif font-bold text-base text-[#0B0B0B]">{winner.stageName || winner.name}</h5>
                    <span className="text-xs text-neutral-500">{winner.country}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center text-xs md:text-right">
                  <span className="text-neutral-500">Audited Vote Tally:</span>
                  <span className="font-mono text-xl font-bold text-emerald-600">
                    {winner.votesCount.toLocaleString()} votes
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Lead over 2nd place: +{leadMargin.toLocaleString()} votes
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-400">No candidates registered in this category.</p>
            )}

            {/* Full Category Roster */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                All Candidates in Category:
              </span>
              <div className="divide-y divide-neutral-100 text-xs">
                {list.map((n, idx) => (
                  <div key={n.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-neutral-400 w-5">#{idx + 1}</span>
                      <span className="font-semibold text-neutral-900">{n.stageName || n.name}</span>
                      <span className="text-neutral-400">({n.country})</span>
                    </div>
                    <span className="font-mono font-bold text-neutral-800">{n.votesCount.toLocaleString()} votes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
