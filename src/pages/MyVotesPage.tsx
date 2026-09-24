import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { VoteTransaction, Nominee } from '../types';
import { OfficialReceiptModal } from '../components/common/OfficialReceiptModal';
import {
  Vote,
  ShieldCheck,
  Clock,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Printer,
  Award,
  TrendingUp,
  User,
  Mail,
  Phone,
  Edit3,
  Check,
  X,
  CreditCard,
  Share2,
  Calendar
} from 'lucide-react';

interface MyVotesPageProps {
  setCurrentTab: (tab: string) => void;
  onOpenVoteModal: (nominee?: Nominee) => void;
  onViewNomineeProfile?: (nominee: Nominee) => void;
}

export const MyVotesPage: React.FC<MyVotesPageProps> = ({
  setCurrentTab,
  onOpenVoteModal,
  onViewNomineeProfile
}) => {
  const {
    transactions,
    voterProfile,
    updateVoterProfile,
    nominees,
    categories,
    formatMoney,
    currency
  } = useApp();

  // Active voter email lookup state
  const [activeEmail, setActiveEmail] = useState<string>(voterProfile.email || 'riderezzy@gmail.com');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(voterProfile.name || 'Rezzy Rider');
  const [editEmail, setEditEmail] = useState<string>(voterProfile.email || 'riderezzy@gmail.com');
  const [editPhone, setEditPhone] = useState<string>(voterProfile.phone || '+2348023456789');

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'refunded'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'votes-desc' | 'amount-desc'>('newest');

  // Selected receipt modal
  const [receiptTx, setReceiptTx] = useState<VoteTransaction | null>(null);

  // Sync edit form if voterProfile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmail.trim()) return;
    updateVoterProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim()
    });
    setActiveEmail(editEmail.trim());
    setIsEditingProfile(false);
  };

  // Switch to sample voter email
  const handleQuickSwitchEmail = (email: string, name: string) => {
    setActiveEmail(email);
    setEditEmail(email);
    setEditName(name);
    updateVoterProfile({ email, name });
    // Check if that email has verified votes and celebrate
    const emailVerified = transactions.some(
      t => t.voterEmail.toLowerCase().trim() === email.toLowerCase().trim() && t.status === 'verified'
    );
    if (emailVerified) {
      setTimeout(() => triggerCelebrationConfetti({ particleCount: 70 }), 150);
    }
  };

  // Filter transactions matching this voter's email
  const voterTransactions = useMemo(() => {
    return transactions.filter(
      t => t.voterEmail.toLowerCase().trim() === activeEmail.toLowerCase().trim()
    );
  }, [transactions, activeEmail]);

  // Filtered & sorted list
  const filteredTransactions = useMemo(() => {
    return voterTransactions
      .filter(t => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNominee = t.nomineeName.toLowerCase().includes(q);
          const matchCategory = t.categoryName.toLowerCase().includes(q);
          const matchRef = t.reference.toLowerCase().includes(q);
          if (!matchNominee && !matchCategory && !matchRef) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'votes-desc') {
          return b.votesCount - a.votesCount;
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        return 0;
      });
  }, [voterTransactions, statusFilter, searchQuery, sortBy]);

  // Aggregate stats
  const totalVotesCast = voterTransactions
    .filter(t => t.status === 'verified')
    .reduce((sum, t) => sum + t.votesCount, 0);

  const totalSpentNGN = voterTransactions
    .filter(t => t.status === 'verified')
    .reduce((sum, t) => sum + (t.currency === 'NGN' ? t.amount : t.amount * 1550), 0);

  const verifiedCount = voterTransactions.filter(t => t.status === 'verified').length;
  const pendingCount = voterTransactions.filter(t => t.status === 'pending').length;

  // Celebratory Confetti Animation Handler
  const triggerCelebrationConfetti = useCallback((options?: { particleCount?: number; intense?: boolean }) => {
    const colors = ['#C9971C', '#E8471C', '#F2A01F', '#10B981', '#FFD700', '#FAF8F4'];
    const pCount = options?.particleCount || 60;

    try {
      // Left Cannon Burst
      confetti({
        particleCount: pCount,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.6 },
        colors,
        zIndex: 9999,
        disableForReducedMotion: true
      });

      // Right Cannon Burst
      confetti({
        particleCount: pCount,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.6 },
        colors,
        zIndex: 9999,
        disableForReducedMotion: true
      });

      // Center Cascading Golden Starburst
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(pCount * 0.8),
          spread: 100,
          origin: { x: 0.5, y: 0.35 },
          colors,
          shapes: ['star', 'circle'],
          zIndex: 9999,
          scalar: 1.15,
          disableForReducedMotion: true
        });
      }, 200);

      if (options?.intense) {
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 90,
            spread: 120,
            origin: { x: 0.5, y: 0.7 },
            colors,
            zIndex: 9999,
            disableForReducedMotion: true
          });
        }, 450);
      }
    } catch {
      // Graceful fallback if browser restricts canvas
    }
  }, []);

  // Trigger celebration on mount or email switch if confirmed votes exist
  useEffect(() => {
    if (verifiedCount > 0) {
      const timer = setTimeout(() => {
        triggerCelebrationConfetti({ intense: true });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeEmail, verifiedCount, triggerCelebrationConfetti]);

  // Find favorite nominee (most votes from this user)
  const nomineeVoteMap: Record<string, number> = {};
  voterTransactions
    .filter(t => t.status === 'verified')
    .forEach(t => {
      nomineeVoteMap[t.nomineeId] = (nomineeVoteMap[t.nomineeId] || 0) + t.votesCount;
    });

  let favoriteNomineeId = '';
  let maxVotes = 0;
  Object.entries(nomineeVoteMap).forEach(([nomId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      favoriteNomineeId = nomId;
    }
  });
  const favoriteNominee = nominees.find(n => n.id === favoriteNomineeId);

  // Patron tier title
  const voterTier =
    totalVotesCast >= 1000
      ? { title: 'Presidential Cultural Patron', badge: 'bg-[#C9971C] text-black font-bold' }
      : totalVotesCast >= 300
      ? { title: 'VIP Cultural Champion', badge: 'bg-[#E8471C] text-white font-bold' }
      : totalVotesCast > 0
      ? { title: 'Official Ballot Voter', badge: 'bg-emerald-600 text-white font-bold' }
      : { title: 'Registered Voter', badge: 'bg-neutral-600 text-white font-normal' };

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-8 sm:py-12">
      {/* Top Banner with subtle African geometric motifs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <button
            onClick={() => setCurrentTab('home')}
            className="hover:text-[#E8471C] transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#0B0B0B] font-semibold">My Votes & Ballot History</span>
        </div>

        {/* Header Hero Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C9971C]/20 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8471C]/10 border border-[#E8471C]/30 text-[#E8471C] text-xs font-bold uppercase tracking-wider mb-2">
              <Vote className="w-3.5 h-3.5" />
              Verified Continental Ballot Portal
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B0B0B] tracking-tight">
              My Official Votes
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base mt-1.5 max-w-2xl">
              Track your verified ballots, real-time confirmation receipts, and patronage contributions for the 7th Edition of Iconic Awards Africa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {verifiedCount > 0 && (
              <button
                onClick={() => triggerCelebrationConfetti({ intense: true })}
                className="px-4 py-2.5 bg-gradient-to-r from-[#C9971C] to-[#E8471C] hover:from-[#d8a320] hover:to-[#d03d15] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                title="Celebrate your verified voting contribution"
              >
                <span className="text-sm">🎉</span>
                <span>Celebrate Ballots</span>
              </button>
            )}

            <button
              onClick={() => onOpenVoteModal()}
              className="px-5 py-2.5 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
            >
              <Vote className="w-4 h-4" />
              Cast New Votes
            </button>
          </div>
        </div>

        {/* Section 0: Celebratory Voting Impact Banner (Only when verified ballots exist) */}
        {verifiedCount > 0 && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#C9971C]/15 via-[#E8471C]/10 to-emerald-500/15 border-2 border-[#C9971C]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#0B0B0B] text-[#C9971C] border border-[#C9971C]/40 flex items-center justify-center text-2xl shadow-md shrink-0">
                🏆
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#0B0B0B]">
                    Ballot History Confirmed & Certified!
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {totalVotesCast.toLocaleString()} Total Votes Counted
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
                  Your votes have been cryptographically recorded on the 7th Edition Iconic Awards Africa ledger. You are actively shaping African cultural history.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => triggerCelebrationConfetti({ particleCount: 80, intense: true })}
                className="px-3.5 py-2 bg-[#0B0B0B] hover:bg-neutral-800 text-[#FAF8F4] text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>🎊</span>
                <span>Replay Confetti</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Voter Profile & Impact Overview Card */}
        <div className="bg-[#0B0B0B] text-[#FAF8F4] rounded-2xl p-6 sm:p-8 shadow-xl border border-[#C9971C]/30 mb-10 relative overflow-hidden">
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9971C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* User Profile Details */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8471C] to-[#C9971C] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-lg shrink-0">
                {voterProfile.name ? voterProfile.name.charAt(0).toUpperCase() : 'V'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {voterProfile.name || 'Verified Voter'}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider ${voterTier.badge}`}>
                    {voterTier.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-[#F2A01F]" />
                    <span>{activeEmail}</span>
                  </div>
                  {voterProfile.phone && (
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-[#F2A01F]" />
                      <span>{voterProfile.phone}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="inline-flex items-center gap-1 text-[#F2A01F] hover:text-[#C9971C] underline font-semibold transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isEditingProfile ? 'Cancel Edit' : 'Change Email / Look Up'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Email Switch Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
              <span className="text-[11px] text-neutral-400 uppercase font-semibold">
                Quick Lookups:
              </span>
              <button
                onClick={() => handleQuickSwitchEmail('riderezzy@gmail.com', 'Rezzy Rider')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeEmail.toLowerCase() === 'riderezzy@gmail.com'
                    ? 'bg-[#E8471C] text-white font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                }`}
              >
                riderezzy@gmail.com
              </button>
              <button
                onClick={() => handleQuickSwitchEmail('chidinma.nwosu@gmail.com', 'Chidinma Nwosu')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeEmail.toLowerCase() === 'chidinma.nwosu@gmail.com'
                    ? 'bg-[#E8471C] text-white font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                }`}
              >
                chidinma.nwosu@gmail.com
              </button>
              <button
                onClick={() => handleQuickSwitchEmail('tariq.mensah@accragroup.gh', 'Tariq Mensah')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeEmail.toLowerCase() === 'tariq.mensah@accragroup.gh'
                    ? 'bg-[#E8471C] text-white font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                }`}
              >
                tariq.mensah@accragroup.gh
              </button>
            </div>
          </div>

          {/* Inline Profile Editing Drawer */}
          {isEditingProfile && (
            <form
              onSubmit={handleSaveProfile}
              className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/40 p-4 rounded-xl"
            >
              <div>
                <label className="block text-[11px] uppercase font-bold text-neutral-300 mb-1">
                  Voter Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#181818] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8471C]"
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-neutral-300 mb-1">
                  Voter Email (Used during checkout)
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8471C]"
                  placeholder="name@domain.com"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] uppercase font-bold text-neutral-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8471C]"
                    placeholder="+234..."
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors h-[34px]"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Voter Stats Cards Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <span className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                Total Votes Cast
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F4]">
                  {totalVotesCast.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Ballots</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <span className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                Contribution Total
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#F2A01F]">
                  {formatMoney(totalSpentNGN)}
                </span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <span className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                Confirmation Status
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {verifiedCount} Verified
                </span>
                {pendingCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5" />
                    {pendingCount} Pending
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
              <span className="text-[11px] font-semibold uppercase text-neutral-400 block mb-1">
                Favorite Nominee
              </span>
              {favoriteNominee ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <img
                    src={favoriteNominee.photoUrl}
                    alt={favoriteNominee.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#C9971C]/50"
                  />
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">
                      {favoriteNominee.stageName || favoriteNominee.name}
                    </span>
                    <span className="text-[10px] text-[#F2A01F] font-semibold">
                      {maxVotes} votes given
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-neutral-400 mt-1 block">No ballots yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Filtering, Searching & Sorting Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#0B0B0B] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Records ({voterTransactions.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                statusFilter === 'verified'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified & Counted ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('refunded')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                statusFilter === 'refunded'
                  ? 'bg-neutral-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Refunded
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search nominee or ref..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0B0B0B] placeholder-neutral-400 focus:outline-none focus:border-[#E8471C] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-700 font-semibold focus:outline-none focus:border-[#E8471C]"
            >
              <option value="newest">Most Recent</option>
              <option value="votes-desc">Highest Votes</option>
              <option value="amount-desc">Highest Amount</option>
            </select>
          </div>
        </div>

        {/* Section 3: List of Voting Records */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 shadow-xs max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#E8471C]/10 text-[#E8471C] flex items-center justify-center mx-auto mb-4">
              <Vote className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0B0B0B] mb-2">
              No Votes Found for this Filter
            </h3>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              We couldn&apos;t find any voting records matching &ldquo;{activeEmail}&rdquo; with the selected criteria.
              Cast votes for your favorite cultural icons to see your verified ballots appear here in real time!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOpenVoteModal()}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#E8471C] hover:bg-[#c93912] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Vote className="w-4 h-4" />
                Vote for a Nominee Now
              </button>
              <button
                onClick={() => handleQuickSwitchEmail('riderezzy@gmail.com', 'Rezzy Rider')}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                View Demo Voter Records
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map(tx => {
              const nominee = nominees.find(n => n.id === tx.nomineeId);
              const isVerified = tx.status === 'verified';
              const isPending = tx.status === 'pending';
              const isRefunded = tx.status === 'refunded';

              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl border border-neutral-200/90 shadow-xs hover:border-[#C9971C]/50 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left Column: Nominee & Category & Ballots */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Nominee Photo */}
                    <div className="relative shrink-0">
                      {nominee?.photoUrl ? (
                        <img
                          src={nominee.photoUrl}
                          alt={tx.nomineeName}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#C9971C]/30 shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#0B0B0B] text-[#C9971C] flex items-center justify-center font-bold">
                          <Award className="w-6 h-6" />
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 bg-[#E8471C] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                        7th
                      </span>
                    </div>

                    {/* Information Block */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-serif font-bold text-base sm:text-lg text-[#0B0B0B] truncate">
                          {tx.nomineeName}
                        </h4>

                        {/* Confirmation Status Pill */}
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified & Counted
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Gateway Verification
                          </span>
                        )}
                        {isRefunded && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-600 border border-neutral-300">
                            <RotateCcw className="w-3 h-3" />
                            Refunded
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-600 truncate mb-1">
                        {tx.categoryName}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {new Date(tx.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}{' '}
                          at{' '}
                          {new Date(tx.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span>•</span>
                        <span className="text-neutral-600">Ref: {tx.reference}</span>
                        {tx.promoCodeUsed && (
                          <>
                            <span>•</span>
                            <span className="text-[#E8471C] font-semibold font-sans">
                              Code: {tx.promoCodeUsed}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Vote Count & Price */}
                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Ballots Cast
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#E8471C]">
                        +{tx.votesCount}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        Paid via {tx.gateway}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Amount Paid
                      </span>
                      <span className="font-serif text-base sm:text-lg font-bold text-[#0B0B0B]">
                        {tx.currency === 'USD'
                          ? `$${tx.amount.toFixed(2)}`
                          : `₦${tx.amount.toLocaleString('en-NG')}`}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold block flex items-center justify-end gap-1">
                        <ShieldCheck className="w-3 h-3" /> Audit Verified
                      </span>
                    </div>

                    {/* Right Column Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={() => {
                          if (isVerified) {
                            triggerCelebrationConfetti({ particleCount: 35 });
                          }
                          setReceiptTx(tx);
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 bg-[#0B0B0B] hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        title="View Official Certificate"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#F2A01F]" />
                        Official Receipt
                      </button>

                      <button
                        onClick={() => onOpenVoteModal(nominee || undefined)}
                        className="w-full sm:w-auto px-3.5 py-2 bg-[#FAF8F4] hover:bg-neutral-200 text-[#0B0B0B] border border-neutral-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Cast More Votes for Nominee"
                      >
                        <Vote className="w-3.5 h-3.5 text-[#E8471C]" />
                        Vote Again
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section 4: Public Audit & Integrity Guarantee Note */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-[#C9971C]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9971C]/15 text-[#C9971C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#0B0B0B]">
                IAA Verified Continental Voting Guarantee
              </h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                Every transaction on Iconic Awards Africa is processed through regulated African payment rails (Paystack and Flutterwave) and logged immutably onto the public certification tally. In case of inquiries or receipt reconciliation, email us at{' '}
                <a href="mailto:voting@iconicawardsafrica.com" className="text-[#E8471C] font-semibold underline">
                  voting@iconicawardsafrica.com
                </a>.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('leaderboard')}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#0B0B0B] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#E8471C]" />
              Live Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      <OfficialReceiptModal
        isOpen={!!receiptTx}
        onClose={() => setReceiptTx(null)}
        transaction={receiptTx}
        onVoteAgain={(nomineeId) => {
          const nom = nominees.find(n => n.id === nomineeId);
          onOpenVoteModal(nom);
        }}
      />
    </div>
  );
};
