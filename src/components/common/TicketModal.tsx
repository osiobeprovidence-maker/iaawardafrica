import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketTier, TicketOrder } from '../../types';
import {
  X,
  CheckCircle2,
  Lock,
  Ticket,
  QrCode,
  ShieldCheck,
  Printer,
  Calendar,
  MapPin
} from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier?: TicketTier | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  selectedTier = null
}) => {
  const {
    currency,
    formatMoney,
    ticketTiers,
    events,
    purchaseTickets
  } = useApp();

  const activeEvent = events[0];
  const [tierId, setTierId] = useState<string>(selectedTier?.id || ticketTiers[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [gateway, setGateway] = useState<'paystack' | 'flutterwave'>('paystack');

  const [step, setStep] = useState<'form' | 'processing' | 'confirmed'>('form');
  const [confirmedOrder, setConfirmedOrder] = useState<TicketOrder | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedTier) {
      setTierId(selectedTier.id);
    }
    if (isOpen) {
      setStep('form');
      setError('');
    }
  }, [selectedTier, isOpen]);

  if (!isOpen) return null;

  const currentTier = ticketTiers.find(t => t.id === tierId) || selectedTier || ticketTiers[0];
  const unitPrice = currency === 'USD' ? currentTier?.priceUSD || 0 : currentTier?.priceNGN || 0;
  const totalPrice = unitPrice * quantity;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!buyerName.trim()) {
      setError('Please enter your full legal name');
      return;
    }
    if (!buyerEmail.trim() || !buyerEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!buyerPhone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setStep('processing');

    setTimeout(async () => {
      const res = await purchaseTickets({
        eventId: activeEvent?.id || 'evt-gala-2026',
        tierId: currentTier.id,
        quantity,
        buyerName,
        buyerEmail,
        buyerPhone,
        gateway,
        currency
      });

      if (res.success) {
        setConfirmedOrder(res.order);
        setStep('confirmed');
      } else {
        setError(res.error || 'Failed to complete ticket purchase');
        setStep('form');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF8F4] text-[#0B0B0B] rounded-xl shadow-2xl border border-[#C9971C]/40 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#0B0B0B] text-[#FAF8F4] px-5 py-4 flex items-center justify-between border-b border-[#C9971C]/30">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#F2A01F]" />
            <h3 className="font-serif font-bold text-base tracking-wide text-gold-gradient">
              {step === 'confirmed' ? 'Official Gala Admission Pass' : 'Reserve Gala Night Tickets'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#FAF8F4]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {step === 'form' && (
            <form onSubmit={handlePurchase} className="space-y-4">
              {/* Event brief */}
              <div className="bg-[#0B0B0B] text-white p-3.5 rounded-lg border border-[#C9971C]/30">
                <span className="text-[10px] uppercase font-bold text-[#F2A01F] tracking-widest">
                  Iconic Awards Africa Gala Night
                </span>
                <h4 className="font-serif font-bold text-sm text-white mt-0.5">
                  {activeEvent?.title}
                </h4>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#FAF8F4]/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E8471C]" />
                    {new Date(activeEvent?.date || '').toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E8471C]" />
                    {activeEvent?.venue}, {activeEvent?.city}
                  </span>
                </div>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70 mb-1.5">
                  Select Ticket Tier
                </label>
                <div className="space-y-2">
                  {ticketTiers.map(t => {
                    const isSelected = t.id === tierId;
                    const price = currency === 'USD' ? `$${t.priceUSD}` : `₦${t.priceNGN.toLocaleString()}`;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setTierId(t.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#0B0B0B] text-white border-[#E8471C] ring-1 ring-[#E8471C]'
                            : 'bg-white text-neutral-900 border-neutral-200 hover:border-[#C9971C]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-xs block">{t.name}</span>
                            <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-white/70' : 'text-neutral-500'}`}>
                              {t.description}
                            </span>
                          </div>
                          <span className="text-sm font-extrabold text-[#F2A01F] shrink-0 ml-2">
                            {price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70 mb-1">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Total: <strong className="text-[#0B0B0B] font-bold">{currency === 'USD' ? `$${totalPrice.toFixed(2)}` : `₦${totalPrice.toLocaleString()}`}</strong>
                  </span>
                </div>
              </div>

              {/* Buyer info */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70">
                  Guest Information
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Primary Attendee Full Name"
                  className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#E8471C]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#E8471C]"
                  />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="Mobile Number"
                    className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#E8471C]"
                  />
                </div>
              </div>

              {/* Gateway */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setGateway('paystack')}
                    className={`p-2 rounded border font-semibold ${gateway === 'paystack' ? 'bg-cyan-50 border-cyan-500 text-cyan-900' : 'bg-white border-neutral-200'}`}
                  >
                    Paystack
                  </button>
                  <button
                    type="button"
                    onClick={() => setGateway('flutterwave')}
                    className={`p-2 rounded border font-semibold ${gateway === 'flutterwave' ? 'bg-amber-50 border-amber-500 text-amber-900' : 'bg-white border-neutral-200'}`}
                  >
                    Flutterwave
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs uppercase font-bold tracking-wider rounded-md shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                Pay {currency === 'USD' ? `$${totalPrice.toFixed(2)}` : `₦${totalPrice.toLocaleString()}`} & Issue Pass
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-[#E8471C] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="font-serif font-bold text-base">Securing Gala Table Reservation...</h4>
              <p className="text-xs text-neutral-500">Communicating with payment gateway</p>
            </div>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#0B0B0B]">
                Gala Night Pass Confirmed!
              </h4>
              <p className="text-xs text-neutral-600">
                Your admission QR credential has been generated. Please present this at the Eko Hotel red carpet accreditation desk.
              </p>

              {/* Digital Pass Card */}
              <div className="bg-[#0B0B0B] text-white p-5 rounded-xl border border-[#C9971C]/50 space-y-3 text-left">
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#F2A01F] font-bold block">
                      VIP PASS · 7TH EDITION
                    </span>
                    <h5 className="font-serif font-bold text-base text-white">{confirmedOrder.tierName}</h5>
                  </div>
                  <div className="w-14 h-14 bg-white p-1 rounded-md flex items-center justify-center text-black">
                    <QrCode className="w-12 h-12" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Guest Name</span>
                    <strong className="text-white">{confirmedOrder.buyerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Pass Reference</span>
                    <span className="font-mono text-white text-[11px]">{confirmedOrder.reference}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Quantity</span>
                    <span className="text-white">{confirmedOrder.quantity} Guest(s)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Status</span>
                    <span className="text-emerald-400 font-bold">VERIFIED ACCESS</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-3 border border-neutral-300 hover:bg-neutral-100 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save Pass
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 bg-[#0B0B0B] hover:bg-neutral-800 text-white rounded text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
