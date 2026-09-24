import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Vote,
  DollarSign,
  Calendar,
  Users,
  Award,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const {
    transactions,
    ticketOrders,
    nominees,
    categories,
    events,
    currency,
    formatMoney
  } = useApp();

  // Metrics
  const totalVotes = nominees.reduce((acc, n) => acc + n.votesCount, 0);

  const totalVotingRevenueNGN = transactions
    .filter(t => t.status === 'verified')
    .reduce((acc, t) => acc + (t.currency === 'NGN' ? t.amount : t.amount * 1500), 0);

  const totalTicketRevenueNGN = ticketOrders
    .filter(o => o.status === 'confirmed')
    .reduce((acc, o) => acc + (o.currency === 'NGN' ? o.totalAmount : o.totalAmount * 1500), 0);

  const totalGrossRevenueNGN = totalVotingRevenueNGN + totalTicketRevenueNGN;

  const activeEventsCount = events.filter(e => e.status === 'upcoming' || e.status === 'live').length;

  const topNominees = [...nominees].sort((a, b) => b.votesCount - a.votesCount).slice(0, 5);

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="font-serif font-bold text-2xl text-[#0B0B0B]">Executive Dashboard Overview</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Real-time metrics on voting velocity, gate revenues, and transactional audits.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Verified Votes */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] uppercase font-bold tracking-wider">Total Verified Votes</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8471C]/10 text-[#E8471C] flex items-center justify-center">
              <Vote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#0B0B0B] tabular-nums">
              {totalVotes.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% velocity this week</span>
            </div>
          </div>
        </div>

        {/* Total Combined Revenue */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] uppercase font-bold tracking-wider">Gross Ledger Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#0B0B0B] tabular-nums">
              ₦{totalGrossRevenueNGN.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              ~${Math.round(totalGrossRevenueNGN / 1500).toLocaleString()} USD equiv.
            </div>
          </div>
        </div>

        {/* Voting vs Ticket Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] uppercase font-bold tracking-wider">Voting Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#0B0B0B] tabular-nums">
              ₦{totalVotingRevenueNGN.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Tickets: ₦{totalTicketRevenueNGN.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] uppercase font-bold tracking-wider">Active Gala Events</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#0B0B0B] tabular-nums">
              {activeEventsCount} Active
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {nominees.length} Nominees in {categories.length} Categories
            </div>
          </div>
        </div>
      </div>

      {/* Charts / Visual Velocity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voting Velocity Histogram */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#0B0B0B]">Hourly Voting Velocity & Gateway Activity</h3>
              <p className="text-xs text-neutral-500">Aggregate volume over past 7 days</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
              ● All Systems Operational
            </span>
          </div>

          {/* Simple Clean Bar Chart Representation */}
          <div className="pt-6 space-y-2">
            <div className="h-44 flex items-end justify-between gap-2 border-b border-neutral-200 pb-2">
              {[
                { day: 'Mon', count: 1850, pct: 35 },
                { day: 'Tue', count: 2400, pct: 45 },
                { day: 'Wed', count: 3200, pct: 60 },
                { day: 'Thu', count: 2900, pct: 55 },
                { day: 'Fri', count: 4800, pct: 85 },
                { day: 'Sat', count: 5600, pct: 100 },
                { day: 'Sun', count: 4100, pct: 75 },
              ].map((bar, i) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.count}
                  </span>
                  <div
                    className="w-full bg-[#0B0B0B] hover:bg-[#E8471C] rounded-t transition-all cursor-pointer"
                    style={{ height: `${bar.pct}%` }}
                  />
                  <span className="text-[11px] font-medium text-neutral-600">{bar.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
              <span>Paystack: 78% of transactions</span>
              <span>Flutterwave: 22% of transactions</span>
            </div>
          </div>
        </div>

        {/* Top 5 Nominees */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#0B0B0B]">Leading Nominees</h3>
            <span className="text-xs text-[#E8471C] font-semibold">Live Rank</span>
          </div>

          <div className="space-y-3">
            {topNominees.map((n, idx) => (
              <div key={n.id} className="flex items-center justify-between gap-3 text-xs pb-2 border-b border-neutral-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-bold text-neutral-400 w-4">#{idx + 1}</span>
                  <img
                    src={n.photoUrl}
                    alt={n.name}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-neutral-900 block truncate">{n.stageName || n.name}</span>
                    <span className="text-[10px] text-neutral-500 block truncate">{n.country}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#0B0B0B] shrink-0 tabular-nums">
                  {n.votesCount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#0B0B0B]">Recent Verified Transactions</h3>
            <p className="text-xs text-neutral-500">Live payment webhook audit stream</p>
          </div>
          <span className="text-xs text-neutral-500">Showing last {recentTransactions.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Voter</th>
                <th className="py-3 px-4">Nominee</th>
                <th className="py-3 px-4">Votes</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {recentTransactions.map(t => (
                <tr key={t.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-700">{t.reference}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-neutral-900">{t.voterName}</div>
                    <div className="text-[11px] text-neutral-400">{t.voterEmail}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-800">{t.nomineeName}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">+{t.votesCount}</td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    {t.currency === 'USD' ? `$${t.amount.toFixed(2)}` : `₦${t.amount.toLocaleString()}`}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-neutral-600">{t.gateway}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                    {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
