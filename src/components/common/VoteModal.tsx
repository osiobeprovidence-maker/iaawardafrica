import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Nominee, VoteBundle, Currency, VoteTransaction } from '../../types';
import {
  X,
  CheckCircle2,
  Lock,
  CreditCard,
  ShieldCheck,
  Printer,
  Share2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Vote
} from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNominee?: Nominee | null;
  onNavigateToMyVotes?: () => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  initialNominee = null,
  onNavigateToMyVotes
}) => {
  const {
    currency,
    setCurrency,
    formatMoney,
    convertNGNToUSD,
    nominees,
    categories,
    voteBundles,
    promoCodes,
    votingSettings,
    submitVote
  } = useApp();

  const [selectedNomineeId, setSelectedNomineeId] = useState<string>('');
  const [selectedBundleId, setSelectedBundleId] = useState<string>('bundle-50');
  const [customVotes, setCustomVotes] = useState<number | ''>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercentage: number;
    bonusVotesPercentage: number;
  } | null>(null);
  const [promoError, setPromoError] = useState('');

  const [gateway, setGateway] = useState<'paystack' | 'flutterwave'>('paystack');

  // Checkout phases: 'details' -> 'payment_modal' -> 'verifying_webhook' -> 'success'
  const [step, setStep] = useState<'details' | 'payment_modal' | 'verifying_webhook' | 'success'>('details');
  const [completedTransaction, setCompletedTransaction] = useState<VoteTransaction | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (initialNominee) {
      setSelectedNomineeId(initialNominee.id);
    } else if (nominees.length > 0 && !selectedNomineeId) {
      setSelectedNomineeId(nominees[0].id);
    }
  }, [initialNominee, nominees]);

  if (!isOpen) return null;

  const currentNominee = nominees.find(n => n.id === selectedNomineeId) || initialNominee || nominees[0];
  const currentCategory = currentNominee ? categories.find(c => c.id === currentNominee.categoryId) : null;

  // Calculate vote count & total amount
  let voteCount = 50;
  if (isCustom && typeof customVotes === 'number' && customVotes > 0) {
    voteCount = customVotes;
  } else {
    const b = voteBundles.find(item => item.id === selectedBundleId);
    if (b) voteCount = b.votes;
  }

  // Bonus votes from promo
  let bonusVotes = 0;
  if (appliedPromo && appliedPromo.bonusVotesPercentage > 0) {
    bonusVotes = Math.round(voteCount * (appliedPromo.bonusVotesPercentage / 100));
  }
  const totalVotesToDeliver = voteCount + bonusVotes;

  // Base price
  let baseAmount = currency === 'USD'
    ? (voteCount * votingSettings.basePricePerVoteUSD)
    : (voteCount * votingSettings.basePricePerVoteNGN);

  if (!isCustom) {
    const matchingBundle = voteBundles.find(b => b.id === selectedBundleId);
    if (matchingBundle) {
      baseAmount = currency === 'USD' ? matchingBundle.priceUSD : matchingBundle.priceNGN;
    }
  }

  // Discount
  let discountAmount = 0;
  if (appliedPromo && appliedPromo.discountPercentage > 0) {
    discountAmount = baseAmount * (appliedPromo.discountPercentage / 100);
  }
  const finalPayableAmount = Math.max(0, baseAmount - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const codeClean = promoCodeInput.trim().toUpperCase();
    if (!codeClean) return;

    const match = promoCodes.find(p => p.code.toUpperCase() === codeClean && p.isActive);
    if (match) {
      setAppliedPromo({
        code: match.code,
        discountPercentage: match.discountPercentage,
        bonusVotesPercentage: match.bonusVotesPercentage
      });
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code. Try "VIPAFRICA"');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!voterName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!voterEmail.trim() || !voterEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!voterPhone.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }
    if (totalVotesToDeliver <= 0) {
      setErrorMessage('Please select at least 1 vote');
      return;
    }

    setStep('payment_modal');
  };

  const handleSimulatePaymentApproval = async () => {
    setIsProcessing(true);
    setStep('verifying_webhook');

    // Simulate real webhook roundtrip to server
    setTimeout(async () => {
      try {
        const res = await submitVote({
          nomineeId: currentNominee.id,
          votesCount: totalVotesToDeliver,
          voterName,
          voterEmail,
          voterPhone,
          currency,
          gateway,
          promoCode: appliedPromo?.code
        });

        if (res.success) {
          setCompletedTransaction(res.transaction);
          setStep('success');
        } else {
          setErrorMessage(res.error || 'Verification failed. Please retry.');
          setStep('details');
        }
      } catch (err) {
        setErrorMessage('A network error occurred during payment verification.');
        setStep('details');
      } finally {
        setIsProcessing(false);
      }
    }, 1600);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareOnSocial = (platform: 'whatsapp' | 'twitter') => {
    const text = encodeURIComponent(`I just cast ${totalVotesToDeliver} verified votes for ${currentNominee?.stageName || currentNominee?.name} at Iconic Awards Africa (7th Edition)! Support African culture now.`);
    const url = encodeURIComponent(window.location.origin);

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF8F4] text-[#0B0B0B] rounded-xl shadow-2xl border border-[#C9971C]/40 overflow-hidden my-6">
        {/* Top Header Bar */}
        <div className="bg-[#0B0B0B] text-[#FAF8F4] px-5 py-4 flex items-center justify-between border-b border-[#C9971C]/30">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-[#F2A01F]" />
            <h3 className="font-serif font-bold text-base tracking-wide text-gold-gradient">
              {step === 'success' ? 'Official Voting Receipt' : 'Cast Official Public Vote'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#FAF8F4]/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {/* STEP 1: Details & Vote Selection */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Selected Nominee Card */}
              {currentNominee && (
                <div className="bg-[#0B0B0B] text-[#FAF8F4] p-3.5 rounded-lg border border-[#C9971C]/30 flex items-center gap-3.5">
                  <img
                    src={currentNominee.photoUrl}
                    alt={currentNominee.name}
                    className="w-14 h-14 rounded-md object-cover border border-[#F2A01F]/40 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#F2A01F] block truncate">
                      {currentCategory?.name || 'Category'}
                    </span>
                    <h4 className="font-serif font-bold text-base text-white truncate">
                      {currentNominee.stageName || currentNominee.name}
                    </h4>
                    <p className="text-[11px] text-[#FAF8F4]/60">
                      {currentNominee.country} · Current: {currentNominee.votesCount.toLocaleString()} votes
                    </p>
                  </div>
                  {/* Currency Switcher */}
                  <div className="shrink-0 flex items-center bg-[#1F1F1F] rounded-md p-0.5 border border-white/10 text-[10px] sm:text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCurrency('NGN')}
                      className={`px-1.5 sm:px-2 py-0.5 rounded transition-colors whitespace-nowrap ${currency === 'NGN' ? 'bg-[#E8471C] text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      ₦ NGN
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-1.5 sm:px-2 py-0.5 rounded transition-colors whitespace-nowrap ${currency === 'USD' ? 'bg-[#E8471C] text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>
              )}

              {/* Vote Bundle Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70 mb-2">
                  Select Vote Package
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {voteBundles.map(bundle => {
                    const isSelected = !isCustom && selectedBundleId === bundle.id;
                    const priceFormatted = currency === 'USD'
                      ? `$${bundle.priceUSD.toFixed(2)}`
                      : `₦${bundle.priceNGN.toLocaleString()}`;

                    return (
                      <button
                        type="button"
                        key={bundle.id}
                        onClick={() => {
                          setIsCustom(false);
                          setSelectedBundleId(bundle.id);
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all relative ${
                          isSelected
                            ? 'bg-[#0B0B0B] text-white border-[#E8471C] shadow-md ring-1 ring-[#E8471C]'
                            : 'bg-white text-[#0B0B0B] border-neutral-200 hover:border-[#C9971C]'
                        }`}
                      >
                        {bundle.popular && (
                          <span className="absolute -top-2 right-2 bg-[#E8471C] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm shadow">
                            Best Value
                          </span>
                        )}
                        <span className="block text-sm font-bold">
                          {bundle.votes} {bundle.votes === 1 ? 'Vote' : 'Votes'}
                        </span>
                        <span className={`block text-xs font-semibold mt-0.5 ${isSelected ? 'text-[#F2A01F]' : 'text-[#E8471C]'}`}>
                          {priceFormatted}
                        </span>
                        {bundle.discountPercentage && bundle.discountPercentage > 0 && (
                          <span className="text-[10px] text-emerald-600 block mt-0.5">
                            Save {bundle.discountPercentage}%
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Custom Vote Button */}
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isCustom
                        ? 'bg-[#0B0B0B] text-white border-[#E8471C] shadow-md ring-1 ring-[#E8471C]'
                        : 'bg-white text-[#0B0B0B] border-neutral-200 hover:border-[#C9971C]'
                    }`}
                  >
                    <span className="block text-sm font-bold">Custom</span>
                    <span className={`block text-xs font-semibold mt-0.5 ${isCustom ? 'text-[#F2A01F]' : 'text-neutral-500'}`}>
                      Enter quantity
                    </span>
                  </button>
                </div>

                {isCustom && (
                  <div className="mt-2.5">
                    <input
                      type="number"
                      min={1}
                      max={votingSettings.maxVotesPerTransaction}
                      value={customVotes}
                      onChange={(e) => setCustomVotes(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))}
                      placeholder="Enter number of votes (e.g. 250)"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8471C]"
                    />
                    <span className="text-[11px] text-neutral-500 mt-1 block">
                      Base price: {currency === 'USD' ? `$${votingSettings.basePricePerVoteUSD} / vote` : `₦${votingSettings.basePricePerVoteNGN} / vote`}
                    </span>
                  </div>
                )}
              </div>

              {/* Promo Code Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70 mb-1.5">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter code (e.g. VIPAFRICA)"
                    className="flex-1 bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-xs uppercase tracking-wider focus:outline-none focus:border-[#E8471C]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 bg-[#0B0B0B] text-white text-xs font-semibold rounded-md hover:bg-neutral-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-[#E8471C] mt-1 font-medium">{promoError}</p>
                )}
                {appliedPromo && (
                  <div className="mt-1.5 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    <span>
                      ✓ Promo <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercentage}% discount
                      {appliedPromo.bonusVotesPercentage > 0 ? ` + ${appliedPromo.bonusVotesPercentage}% bonus votes` : ''})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-neutral-500 hover:text-neutral-800 text-[10px] underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Voter Information Form */}
              <div className="space-y-3 pt-1 border-t border-neutral-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70">
                  Voter Identification (For Official Ballot Audits)
                </label>
                <div>
                  <input
                    type="text"
                    required
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#E8471C]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    required
                    value={voterEmail}
                    onChange={(e) => setVoterEmail(e.target.value)}
                    placeholder="Email Address (for receipt)"
                    className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#E8471C]"
                  />
                  <input
                    type="tel"
                    required
                    value={voterPhone}
                    onChange={(e) => setVoterPhone(e.target.value)}
                    placeholder="Phone Number (+234...)"
                    className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#E8471C]"
                  />
                </div>
              </div>

              {/* Gateway Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]/70 mb-2">
                  Select Verified African Gateway
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGateway('paystack')}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      gateway === 'paystack'
                        ? 'border-[#00C3F7] bg-cyan-50/50 ring-1 ring-[#00C3F7]'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Paystack</span>
                      <span className="block text-[10px] text-slate-500">Cards, Transfer, USSD</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#00C3F7] bg-white px-1.5 py-0.5 rounded border">
                      Default
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGateway('flutterwave')}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      gateway === 'flutterwave'
                        ? 'border-[#F5A623] bg-amber-50/50 ring-1 ring-[#F5A623]'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Flutterwave</span>
                      <span className="block text-[10px] text-slate-500">Intl Cards, MoMo, Apple Pay</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#F5A623] bg-white px-1.5 py-0.5 rounded border">
                      Pan-Africa
                    </span>
                  </button>
                </div>
              </div>

              {/* Order Summary & Submit Button */}
              <div className="bg-neutral-100 p-3.5 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Votes allocated:</span>
                  <span className="font-semibold text-neutral-900">
                    {voteCount} {bonusVotes > 0 ? `+ ${bonusVotes} bonus = ${totalVotesToDeliver} votes` : 'votes'}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount applied:</span>
                    <span>-{currency === 'USD' ? `$${discountAmount.toFixed(2)}` : `₦${discountAmount.toLocaleString()}`}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1.5 border-t border-neutral-200">
                  <span>Total Payable:</span>
                  <span className="text-[#E8471C] text-base">
                    {currency === 'USD' ? `$${finalPayableAmount.toFixed(2)}` : `₦${finalPayableAmount.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs uppercase font-bold tracking-wider rounded-md shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                Proceed to Secure Checkout ({currency === 'USD' ? `$${finalPayableAmount.toFixed(2)}` : `₦${finalPayableAmount.toLocaleString()}`})
              </button>

              <p className="text-[10px] text-center text-neutral-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL encrypted. Votes tallied only after official server webhook receipt.</span>
              </p>
            </form>
          )}

          {/* STEP 2: Simulated Gateway Checkout Modal */}
          {step === 'payment_modal' && (
            <div className="space-y-5">
              <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${gateway === 'paystack' ? 'bg-[#00C3F7]' : 'bg-[#F5A623]'}`} />
                    <span className="text-xs font-bold tracking-wide uppercase text-neutral-700">
                      {gateway === 'paystack' ? 'Paystack Checkout Popup' : 'Flutterwave Checkout Modal'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">Sandbox / Live Ready</span>
                </div>

                <div className="py-4 space-y-3 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Payment to Iconic Awards Africa</span>
                  <div className="text-2xl font-extrabold text-[#0B0B0B]">
                    {currency === 'USD' ? `$${finalPayableAmount.toFixed(2)}` : `₦${finalPayableAmount.toLocaleString()}`}
                  </div>
                  <p className="text-xs text-neutral-600">
                    Allocating <strong>{totalVotesToDeliver} votes</strong> to <strong>{currentNominee?.stageName || currentNominee?.name}</strong>
                  </p>
                </div>

                {/* Simulated Payment Card / Method */}
                <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-neutral-700" />
                      Test Card / Authorized Account
                    </span>
                    <span className="font-mono text-neutral-800">•••• 4242</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Billed to: <strong>{voterName}</strong> ({voterEmail})
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSimulatePaymentApproval}
                    disabled={isProcessing}
                    className="w-full py-2.5 px-4 bg-[#0B0B0B] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#F2A01F]" />
                    Authorize Payment & Trigger Webhook
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    disabled={isProcessing}
                    className="w-full py-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
                  >
                    Cancel & Return to Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Server Webhook Verification */}
          {step === 'verifying_webhook' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 border-4 border-[#E8471C] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">
                  Verifying Payment With Gateway Webhook...
                </h4>
                <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto">
                  Executing server-side cryptographic signature audit and fraud velocity check to ensure your vote is official.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Official Receipt */}
          {step === 'success' && completedTransaction && (
            <div className="space-y-5" id="printable-receipt">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#0B0B0B]">
                  Votes Successfully Tallied!
                </h4>
                <p className="text-xs text-neutral-600">
                  An official transaction confirmation has been recorded on the IAA ledger.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-[#0B0B0B]">{completedTransaction.reference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Candidate:</span>
                  <span className="font-bold text-[#0B0B0B]">{completedTransaction.nomineeName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Category:</span>
                  <span className="text-neutral-800 text-right max-w-[200px] truncate">{completedTransaction.categoryName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Votes Cast:</span>
                  <span className="font-bold text-emerald-600 text-sm">+{completedTransaction.votesCount} Votes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Amount Paid:</span>
                  <span className="font-semibold text-neutral-900">
                    {completedTransaction.currency === 'USD' ? `$${completedTransaction.amount.toFixed(2)}` : `₦${completedTransaction.amount.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Gateway:</span>
                  <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-700">
                    {completedTransaction.gateway}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                  <span>Timestamp:</span>
                  <span>{new Date(completedTransaction.createdAt).toLocaleTimeString()} · {new Date(completedTransaction.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="py-2 px-3 border border-neutral-300 hover:bg-neutral-100 rounded-md text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => handleShareOnSocial('whatsapp')}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-md text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share on WhatsApp
                </button>
              </div>

              {onNavigateToMyVotes && (
                <button
                  type="button"
                  onClick={onNavigateToMyVotes}
                  className="w-full py-2.5 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Vote className="w-3.5 h-3.5" />
                  View in My Votes & Ballot History
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-[#0B0B0B] text-xs font-semibold rounded-md transition-colors"
              >
                Close & View Leaderboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
