import React from 'react';
import { VoteTransaction } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  User,
  Award,
  Hash,
  Share2,
  ExternalLink,
  Vote
} from 'lucide-react';

interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: VoteTransaction | null;
  onVoteAgain?: (nomineeId: string) => void;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onVoteAgain
}) => {
  const { formatMoney, nominees } = useApp();

  if (!isOpen || !transaction) return null;

  const nominee = nominees.find(n => n.id === transaction.nomineeId);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    const text = encodeURIComponent(
      `Official Voting Receipt: I supported ${transaction.nomineeName} with ${transaction.votesCount} verified votes at Iconic Awards Africa (7th Edition)! Ref: ${transaction.reference}`
    );
    const url = encodeURIComponent(window.location.origin);
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-[#FAF8F4] text-[#0B0B0B] rounded-2xl shadow-2xl border border-[#C9971C]/50 overflow-hidden my-6 print:border-none print:shadow-none print:my-0">
        {/* Modal Top Bar (hidden on print) */}
        <div className="bg-[#0B0B0B] text-[#FAF8F4] px-6 py-4 flex items-center justify-between border-b border-[#C9971C]/30 print:hidden">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#F2A01F]" />
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base tracking-wide text-gold-gradient">
                Official Ballot Certification
              </h3>
              <p className="text-[11px] text-neutral-400">Iconic Awards Africa Audit Ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close Receipt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-4">
          {/* Header with Logo and Certificate Badge */}
          <div className="flex items-center justify-between border-b border-[#C9971C]/20 pb-5">
            <div className="flex items-center gap-3">
              <img src="/iaa-logo.svg" alt="IAA Logo" className="h-12 w-auto object-contain" />
              <div>
                <h2 className="font-serif font-bold text-lg text-[#0B0B0B] tracking-tight">
                  Iconic Awards Africa
                </h2>
                <p className="text-xs text-[#E8471C] font-semibold">
                  7th Edition · African Cultural Fashion Gala
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED & COUNTED
              </span>
              <p className="text-[10px] text-neutral-500 mt-1 font-mono">{transaction.reference}</p>
            </div>
          </div>

          {/* Nominee Highlight Card */}
          <div className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs flex items-center gap-4">
            {nominee?.photoUrl ? (
              <img
                src={nominee.photoUrl}
                alt={transaction.nomineeName}
                className="w-16 h-16 rounded-lg object-cover border border-[#C9971C]/30 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-[#0B0B0B] text-[#C9971C] flex items-center justify-center font-bold text-xl shrink-0">
                <Award className="w-8 h-8" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9971C]">
                Official Nominee Selected
              </span>
              <h4 className="font-serif font-bold text-base text-[#0B0B0B] truncate">
                {transaction.nomineeName}
              </h4>
              <p className="text-xs text-neutral-600 truncate">{transaction.categoryName}</p>
            </div>
            <div className="text-right shrink-0 bg-[#FAF8F4] px-3 py-2 rounded-lg border border-[#C9971C]/20">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block">Ballot Weight</span>
              <span className="font-serif font-bold text-xl text-[#E8471C]">
                +{transaction.votesCount}
              </span>
              <span className="text-[10px] text-neutral-500 block">Votes</span>
            </div>
          </div>

          {/* Audit & Transaction Ledger Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-0.5">
                Voter Full Name
              </span>
              <span className="font-bold text-neutral-800">{transaction.voterName}</span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-0.5">
                Voter Email
              </span>
              <span className="font-bold text-neutral-800 truncate block font-mono text-[11px]">
                {transaction.voterEmail}
              </span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-0.5">
                Transaction Date & Time
              </span>
              <span className="font-semibold text-neutral-800">
                {new Date(transaction.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-0.5">
                Payment Channel & Gateway
              </span>
              <span className="font-bold text-neutral-800 capitalize flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#E8471C]" />
                {transaction.gateway} ({transaction.currency})
              </span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-0.5">
                Total Amount Paid
              </span>
              <span className="font-bold text-[#0B0B0B] text-sm">
                {transaction.currency === 'USD'
                  ? `$${transaction.amount.toFixed(2)}`
                  : `₦${transaction.amount.toLocaleString('en-NG')}`}
              </span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-0.5">
                Gateway Audit Status
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                200 OK (Settled)
              </span>
            </div>
          </div>

          {/* Audit Verification Stamp Strip */}
          <div className="border-t border-dashed border-neutral-300 pt-4 flex items-center justify-between text-[11px] text-neutral-500">
            <div>
              <p className="font-mono text-[10px] text-neutral-400">
                IP: {transaction.voterIp} · Hash: {transaction.id}
              </p>
              <p className="text-[10px] text-neutral-400">Verified by IAA Continental Voting Ledger</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-[#C9971C]/10 border border-[#C9971C]/30 text-[#0B0B0B] font-bold text-[10px] uppercase">
                Seal of Authenticity
              </span>
            </div>
          </div>

          {/* Actions Bar (hidden on print) */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-[#0B0B0B] text-white hover:bg-black rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#F2A01F]" />
                Print / Save PDF
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Share via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>

            {onVoteAgain && (
              <button
                onClick={() => {
                  onClose();
                  onVoteAgain(transaction.nomineeId);
                }}
                className="px-4 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Vote className="w-3.5 h-3.5" />
                Vote Again for {transaction.nomineeName.split(' ')[0]}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
