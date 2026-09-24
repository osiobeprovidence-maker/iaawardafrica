import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VoteBundle, PromoCode } from '../../types';
import { Settings, Plus, Trash2, Check, Vote, Tag, DollarSign, Clock } from 'lucide-react';

export const AdminVotingSettings: React.FC = () => {
  const {
    votingSettings,
    updateVotingSettings,
    voteBundles,
    setVoteBundles,
    promoCodes,
    setPromoCodes
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Voting settings local state
  const [formSettings, setFormSettings] = useState({ ...votingSettings });

  // Promo code local state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(10);
  const [newPromoBonus, setNewPromoBonus] = useState<number>(0);

  // Vote bundle local state
  const [newBundleVotes, setNewBundleVotes] = useState<number>(200);
  const [newBundlePriceNGN, setNewBundlePriceNGN] = useState<number>(16000);
  const [newBundlePriceUSD, setNewBundlePriceUSD] = useState<number>(22);

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateVotingSettings(formSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const promo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountPercentage: Number(newPromoDiscount) || 0,
      bonusVotesPercentage: Number(newPromoBonus) || 0,
      isActive: true,
      usageCount: 0,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
    setPromoCodes([...promoCodes, promo]);
    setNewPromoCode('');
  };

  const handleDeletePromo = (id: string) => {
    setPromoCodes(promoCodes.filter(p => p.id !== id));
  };

  const handleAddBundle = (e: React.FormEvent) => {
    e.preventDefault();
    const bundle: VoteBundle = {
      id: `bundle-${Date.now()}`,
      votes: Number(newBundleVotes) || 10,
      priceNGN: Number(newBundlePriceNGN) || 1000,
      priceUSD: Number(newBundlePriceUSD) || 1.5,
      popular: false
    };
    setVoteBundles([...voteBundles, bundle]);
  };

  const handleDeleteBundle = (id: string) => {
    setVoteBundles(voteBundles.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Ballot Economics & Gateway Pricing</h3>
        <p className="text-xs text-neutral-500">Configure base unit prices, discount packages, promo codes, and anti-fraud velocity caps.</p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Voting settings successfully updated and broadcast to voter terminal!
        </div>
      )}

      {/* SECTION 1: GENERAL PRICING & LIMITS */}
      <form onSubmit={handleSaveGeneralSettings} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6 text-xs">
        <h4 className="font-serif font-bold text-base text-[#0B0B0B] pb-2 border-b border-neutral-100 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#E8471C]" />
          Base Unit Rates & System Limits
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-neutral-600 mb-1">Base Price / Vote (NGN)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-neutral-400 font-bold">₦</span>
              <input
                type="number"
                min={1}
                value={formSettings.basePricePerVoteNGN}
                onChange={e => setFormSettings({ ...formSettings, basePricePerVoteNGN: Number(e.target.value) })}
                className="w-full border rounded pl-7 pr-3 py-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Base Price / Vote (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-neutral-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min={0.01}
                value={formSettings.basePricePerVoteUSD}
                onChange={e => setFormSettings({ ...formSettings, basePricePerVoteUSD: Number(e.target.value) })}
                className="w-full border rounded pl-7 pr-3 py-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Max Votes / Single Transaction</label>
            <input
              type="number"
              value={formSettings.maxVotesPerTransaction}
              onChange={e => setFormSettings({ ...formSettings, maxVotesPerTransaction: Number(e.target.value) })}
              className="w-full border rounded p-2 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Daily Cap / Voter Email (Fraud Limit)</label>
            <input
              type="number"
              value={formSettings.dailyVoterLimit}
              onChange={e => setFormSettings({ ...formSettings, dailyVoterLimit: Number(e.target.value) })}
              className="w-full border rounded p-2 font-mono"
            />
          </div>
        </div>

        {/* Start / End Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block font-bold text-neutral-600 mb-1">Voting Start Timestamp</label>
            <input
              type="datetime-local"
              value={formSettings.votingStartTime ? formSettings.votingStartTime.slice(0, 16) : ''}
              onChange={e => setFormSettings({ ...formSettings, votingStartTime: new Date(e.target.value).toISOString() })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-bold text-neutral-600 mb-1">Voting Official Deadline</label>
            <input
              type="datetime-local"
              value={formSettings.votingEndTime ? formSettings.votingEndTime.slice(0, 16) : ''}
              onChange={e => setFormSettings({ ...formSettings, votingEndTime: new Date(e.target.value).toISOString() })}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 pt-3 border-t border-neutral-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formSettings.votingOpen}
              onChange={e => setFormSettings({ ...formSettings, votingOpen: e.target.checked })}
            />
            <span className="font-semibold text-neutral-800">Allow Public Ballot Submissions</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formSettings.showPublicVoteCounts}
              onChange={e => setFormSettings({ ...formSettings, showPublicVoteCounts: e.target.checked })}
            />
            <span className="font-semibold text-neutral-800">Display Exact Vote Numbers to Public</span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0B0B0B] hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-md"
          >
            Save Voting Parameters
          </button>
        </div>
      </form>

      {/* SECTION 2: VOTE PACKAGES & BUNDLES */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4 text-xs">
        <h4 className="font-serif font-bold text-base text-[#0B0B0B] pb-2 border-b border-neutral-100 flex items-center gap-2">
          <Vote className="w-4 h-4 text-[#F2A01F]" />
          Configured Vote Packages & Bundles
        </h4>

        {/* Existing Bundles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {voteBundles.map(bundle => (
            <div key={bundle.id} className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900 block text-sm">{bundle.votes} Votes</span>
                <span className="text-[11px] text-neutral-600 font-mono">₦{bundle.priceNGN.toLocaleString()} / ${bundle.priceUSD}</span>
              </div>
              <button
                onClick={() => handleDeleteBundle(bundle.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Bundle Inline Form */}
        <form onSubmit={handleAddBundle} className="pt-3 border-t border-neutral-100 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Votes</label>
            <input
              type="number"
              required
              value={newBundleVotes}
              onChange={e => setNewBundleVotes(parseInt(e.target.value) || 1)}
              className="border rounded p-1.5 w-24"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Price (NGN)</label>
            <input
              type="number"
              required
              value={newBundlePriceNGN}
              onChange={e => setNewBundlePriceNGN(parseInt(e.target.value) || 0)}
              className="border rounded p-1.5 w-28"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Price (USD)</label>
            <input
              type="number"
              step="0.1"
              required
              value={newBundlePriceUSD}
              onChange={e => setNewBundlePriceUSD(parseFloat(e.target.value) || 0)}
              className="border rounded p-1.5 w-24"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#E8471C] text-white font-bold rounded uppercase hover:bg-[#c93912]"
          >
            + Add Bundle
          </button>
        </form>
      </div>

      {/* SECTION 3: PROMO CODES */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4 text-xs">
        <h4 className="font-serif font-bold text-base text-[#0B0B0B] pb-2 border-b border-neutral-100 flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#E8471C]" />
          Promo Codes & Campaign Coupons
        </h4>

        <div className="space-y-2">
          {promoCodes.map(promo => (
            <div key={promo.id} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border mr-2">
                  {promo.code}
                </span>
                <span className="text-neutral-600 text-xs">
                  {promo.discountPercentage}% Discount {promo.bonusVotesPercentage > 0 && `+ ${promo.bonusVotesPercentage}% Bonus Votes`}
                </span>
              </div>
              <button
                onClick={() => handleDeletePromo(promo.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Promo Code Form */}
        <form onSubmit={handleAddPromoCode} className="pt-3 border-t border-neutral-100 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              value={newPromoCode}
              onChange={e => setNewPromoCode(e.target.value.toUpperCase())}
              placeholder="e.g. LAGOSVIP"
              className="border rounded p-1.5 w-32 uppercase font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Discount %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={newPromoDiscount}
              onChange={e => setNewPromoDiscount(parseInt(e.target.value) || 0)}
              className="border rounded p-1.5 w-24"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Bonus Votes %</label>
            <input
              type="number"
              min={0}
              max={200}
              value={newPromoBonus}
              onChange={e => setNewPromoBonus(parseInt(e.target.value) || 0)}
              className="border rounded p-1.5 w-24"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#0B0B0B] text-white font-bold rounded uppercase hover:bg-neutral-800"
          >
            Create Promo
          </button>
        </form>
      </div>
    </div>
  );
};
