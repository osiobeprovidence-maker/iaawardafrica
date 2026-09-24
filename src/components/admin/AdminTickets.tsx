import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketTier } from '../../types';
import { Ticket, Plus, Trash2, Edit2, QrCode, CheckCircle2, DollarSign } from 'lucide-react';

export const AdminTickets: React.FC = () => {
  const { ticketTiers, setTicketTiers, ticketOrders, events, currency, formatMoney } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [tierForm, setTierForm] = useState<Partial<TicketTier>>({
    perks: []
  });
  const [perkInput, setPerkInput] = useState('');

  const totalTicketRevenueNGN = ticketOrders.reduce((sum, o) => sum + (o.currency === 'NGN' ? o.totalAmount : o.totalAmount * 1500), 0);
  const totalPassesIssued = ticketOrders.reduce((sum, o) => sum + o.quantity, 0);

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      eventId: events[0]?.id || 'evt-gala-2026',
      name: tierForm.name || 'New Tier',
      description: tierForm.description || '',
      priceNGN: Number(tierForm.priceNGN) || 25000,
      priceUSD: Number(tierForm.priceUSD) || 35,
      availableQuantity: Number(tierForm.availableQuantity) || 100,
      soldQuantity: 0,
      isActive: true,
      perks: tierForm.perks || ['Official Admission Pass']
    };
    setTicketTiers([...ticketTiers, newTier]);
    setIsCreating(false);
    setTierForm({ perks: [] });
  };

  const handleDeleteTier = (id: string) => {
    if (confirm('Delete this ticket tier?')) {
      setTicketTiers(ticketTiers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Gala Tickets & Pass Sales</h3>
          <p className="text-xs text-neutral-500">Configure ticket tiers, manage VIP hospitality allocations, and audit QR admissions.</p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-3.5 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded-md flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Ticket Tier
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Gate Revenue</span>
          <span className="font-mono text-2xl font-bold text-[#0B0B0B]">₦{totalTicketRevenueNGN.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Passes Issued</span>
          <span className="font-mono text-2xl font-bold text-emerald-600">{totalPassesIssued} Guests</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Configured Tiers</span>
          <span className="font-mono text-2xl font-bold text-[#F2A01F]">{ticketTiers.length} Active Tiers</span>
        </div>
      </div>

      {/* Create Form */}
      {isCreating && (
        <form onSubmit={handleSaveTier} className="bg-white p-6 rounded-xl border-2 border-[#E8471C] shadow-md space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Create New Gala Ticket Tier</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Tier Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Patron Lounge Pass"
                value={tierForm.name || ''}
                onChange={e => setTierForm({ ...tierForm, name: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Price (NGN)</label>
              <input
                type="number"
                required
                value={tierForm.priceNGN || ''}
                onChange={e => setTierForm({ ...tierForm, priceNGN: Number(e.target.value) })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Price (USD)</label>
              <input
                type="number"
                required
                value={tierForm.priceUSD || ''}
                onChange={e => setTierForm({ ...tierForm, priceUSD: Number(e.target.value) })}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Available Quantity</label>
              <input
                type="number"
                required
                value={tierForm.availableQuantity || ''}
                onChange={e => setTierForm({ ...tierForm, availableQuantity: Number(e.target.value) })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Short Description</label>
              <input
                type="text"
                value={tierForm.description || ''}
                onChange={e => setTierForm({ ...tierForm, description: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border rounded font-semibold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E8471C] text-white rounded font-bold uppercase hover:bg-[#c93912]"
            >
              Save Tier
            </button>
          </div>
        </form>
      )}

      {/* Tiers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ticketTiers.map(tier => (
          <div key={tier.id} className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">{tier.name}</h4>
                <button
                  onClick={() => handleDeleteTier(tier.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{tier.description}</p>
              <div className="mt-3 font-mono font-bold text-lg text-[#0B0B0B]">
                ₦{tier.priceNGN.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">/ ${tier.priceUSD}</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {tier.availableQuantity} passes available ({tier.soldQuantity} claimed)
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
              <span className="font-bold text-neutral-700 block text-[10px] uppercase">Perks Included:</span>
              {tier.perks.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8471C]" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Orders Log */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200">
          <h4 className="font-serif font-bold text-sm text-[#0B0B0B]">Pass Orders & Attendee Registry</h4>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b text-neutral-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Pass Reference</th>
              <th className="py-3 px-4">Attendee</th>
              <th className="py-3 px-4">Tier</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Total Paid</th>
              <th className="py-3 px-4">Gateway</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {ticketOrders.map(order => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="py-3 px-4 font-mono font-bold text-neutral-800">{order.reference}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-neutral-900">{order.buyerName}</div>
                  <div className="text-[11px] text-neutral-500">{order.buyerEmail}</div>
                </td>
                <td className="py-3 px-4 font-semibold text-neutral-700">{order.tierName}</td>
                <td className="py-3 px-4 font-bold">{order.quantity} Pass(es)</td>
                <td className="py-3 px-4 font-mono font-bold">
                  {order.currency === 'USD' ? `$${order.totalAmount.toFixed(2)}` : `₦${order.totalAmount.toLocaleString()}`}
                </td>
                <td className="py-3 px-4 uppercase text-[10px] font-bold text-neutral-600">{order.gateway}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
