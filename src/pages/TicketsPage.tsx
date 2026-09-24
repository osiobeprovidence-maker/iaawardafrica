import React from 'react';
import { useApp } from '../context/AppContext';
import { TicketTier } from '../types';
import { Ticket, CheckCircle2, Calendar, MapPin, ShieldCheck } from 'lucide-react';

interface TicketsPageProps {
  onOpenTicketModal: (tier?: TicketTier) => void;
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ onOpenTicketModal }) => {
  const { ticketTiers, events, currency, formatMoney } = useApp();
  const galaEvent = events[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
          <Ticket className="w-3.5 h-3.5 text-[#F2A01F]" />
          <span>7th Edition Gala Night Admission</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B0B0B]">
          Reserve Your Place in African Cultural History
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          Join heads of state, international fashion royalty, legendary artistes, and business leaders at Eko Hotels Grand Ballroom, Lagos on November 28, 2026.
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ticketTiers.map((tier) => {
          const isVip = tier.id === 'tier-vip';
          const price = currency === 'USD' ? `$${tier.priceUSD}` : `₦${tier.priceNGN.toLocaleString()}`;

          return (
            <div
              key={tier.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                isVip
                  ? 'bg-[#0B0B0B] text-white border-2 border-[#C9971C] shadow-2xl ring-1 ring-[#F2A01F]/40 -translate-y-2'
                  : 'bg-white text-[#0B0B0B] border border-neutral-200 shadow-sm hover:border-[#C9971C]'
              }`}
            >
              {isVip && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8471C] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow tracking-wider">
                  Most Popular Experience
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className={`font-serif font-bold text-xl ${isVip ? 'text-white' : 'text-[#0B0B0B]'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isVip ? 'text-white/70' : 'text-neutral-500'}`}>
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className={`text-3xl font-extrabold font-mono tabular-nums ${isVip ? 'text-[#F2A01F]' : 'text-[#0B0B0B]'}`}>
                    {price}
                  </span>
                  <span className={`text-xs block mt-0.5 ${isVip ? 'text-white/50' : 'text-neutral-400'}`}>
                    Single admission pass · All taxes & service incl.
                  </span>
                </div>

                <div className="pt-4 border-t border-neutral-200/40 space-y-2 text-xs">
                  <span className={`font-bold block ${isVip ? 'text-[#FAF8F4]' : 'text-neutral-800'}`}>
                    Pass Entitlements:
                  </span>
                  {tier.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isVip ? 'text-[#F2A01F]' : 'text-[#E8471C]'}`} />
                      <span className={isVip ? 'text-white/80' : 'text-neutral-600'}>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-200/40 space-y-2">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Capacity remaining:</span>
                  <span className="font-semibold text-emerald-500">{tier.availableQuantity} passes left</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenTicketModal(tier)}
                  className={`w-full py-3 px-4 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isVip
                      ? 'bg-[#E8471C] hover:bg-[#c93912] text-white shadow-lg active:scale-98'
                      : 'bg-[#0B0B0B] hover:bg-neutral-800 text-white active:scale-98'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Select & Reserve Pass
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Accreditation Notice */}
      <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>
            Tickets are backed by tamper-proof cryptographic QR codes. Instant PDF delivery to your inbox upon webhook payment completion.
          </span>
        </div>
        <span className="font-semibold text-[#0B0B0B] whitespace-nowrap">
          Inquiries: vip@iconicawardsafrica.com
        </span>
      </div>
    </div>
  );
};
