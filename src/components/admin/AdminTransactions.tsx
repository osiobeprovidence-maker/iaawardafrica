import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VoteTransaction } from '../../types';
import { Search, Download, ShieldCheck, AlertCircle, RotateCcw, Filter, CheckCircle2 } from 'lucide-react';

export const AdminTransactions: React.FC = () => {
  const { transactions, refundTransaction } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');

  const filtered = transactions.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (gatewayFilter !== 'all' && t.gateway !== gatewayFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.reference.toLowerCase().includes(q) ||
        t.voterName.toLowerCase().includes(q) ||
        t.voterEmail.toLowerCase().includes(q) ||
        t.nomineeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Reference', 'Voter Name', 'Voter Email', 'Voter Phone', 'Nominee', 'Category', 'Votes', 'Amount', 'Currency', 'Gateway', 'Status', 'Date'];
    const rows = filtered.map(t => [
      t.reference,
      `"${t.voterName.replace(/"/g, '""')}"`,
      t.voterEmail,
      t.voterPhone,
      `"${t.nomineeName.replace(/"/g, '""')}"`,
      `"${t.categoryName.replace(/"/g, '""')}"`,
      t.votesCount,
      t.amount,
      t.currency,
      t.gateway,
      t.status,
      new Date(t.createdAt).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IAA_Transactions_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefund = (id: string, ref: string) => {
    if (confirm(`Flag transaction ${ref} as refunded and reverse candidate ballot counts?`)) {
      refundTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Ballot Ledger & Gateway Transactions</h3>
          <p className="text-xs text-neutral-500">Immutable record of all public votes with webhook verification proofs and refund flags.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#0B0B0B] hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-md flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ref code, voter name, or candidate..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs"
        >
          <option value="all">All Statuses</option>
          <option value="verified">Verified (Counted)</option>
          <option value="refunded">Refunded (Reversed)</option>
          <option value="flagged">Flagged</option>
        </select>

        <select
          value={gatewayFilter}
          onChange={e => setGatewayFilter(e.target.value)}
          className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs"
        >
          <option value="all">All Gateways</option>
          <option value="paystack">Paystack</option>
          <option value="flutterwave">Flutterwave</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b text-neutral-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Payment Reference</th>
              <th className="py-3 px-4">Voter Contact</th>
              <th className="py-3 px-4">Candidate & Category</th>
              <th className="py-3 px-4">Votes</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Gateway</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-neutral-50">
                <td className="py-3 px-4 font-mono font-bold text-neutral-800">
                  {t.reference}
                  <div className="text-[10px] text-neutral-400 font-normal">
                    {new Date(t.createdAt).toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-neutral-900">{t.voterName}</div>
                  <div className="text-[11px] text-neutral-500">{t.voterEmail}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">{t.voterPhone}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-neutral-800">{t.nomineeName}</div>
                  <div className="text-[11px] text-neutral-500">{t.categoryName}</div>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                  +{t.votesCount}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                  {t.currency === 'USD' ? `$${t.amount.toFixed(2)}` : `₦${t.amount.toLocaleString()}`}
                </td>
                <td className="py-3 px-4 uppercase text-[10px] font-bold text-neutral-600">
                  {t.gateway}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                    t.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.status === 'refunded'
                      ? 'bg-neutral-100 text-neutral-600 line-through'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {t.status === 'verified' ? (
                    <button
                      type="button"
                      onClick={() => handleRefund(t.id, t.reference)}
                      className="px-2.5 py-1 text-[11px] text-neutral-600 hover:text-red-700 hover:bg-red-50 border rounded transition-colors"
                      title="Flag as Refunded and deduct votes"
                    >
                      Flag Refund
                    </button>
                  ) : (
                    <span className="text-[11px] text-neutral-400 italic">Reversed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
