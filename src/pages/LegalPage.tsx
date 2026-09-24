import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { siteContent } = useApp();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 pb-6 border-b border-neutral-200">
        <span className="text-[10px] uppercase tracking-widest text-[#E8471C] font-bold block">
          Governance, Compliance & Transparency
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
          Official Terms of Voting & Anti-Fraud Protocols
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          Last updated: September 2026 for {siteContent.brandName || 'Iconic Awards Africa'} ("The African Cultural Fashion Edition").
        </p>
      </div>

      {/* Section 1: Voting Integrity */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-serif font-bold text-xl text-[#0B0B0B]">
            1. Verified Voting Integrity & Server Audits
          </h2>
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed">
          {siteContent.brandName || 'Iconic Awards Africa'} operates a strictly verified public honours mechanism. Votes are acknowledged and tallied exclusively upon affirmative, server-authoritative cryptographic confirmation from our integrated financial processing gateways (Paystack and Flutterwave). Unconfirmed requests or speculative attempts are rejected immediately.
        </p>
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-2">
          <span className="font-bold text-[#0B0B0B] block">Guaranteed Audit Parameters:</span>
          <p className="text-xs text-neutral-600 italic">
            {siteContent.votingGuidelinesText || 'Every vote cast is cryptographically recorded with cryptographic receipt hash, voter IP verification, and audited ledger reconciliation.'}
          </p>
          <ul className="list-disc list-inside space-y-1 pt-1">
            <li>Zero automated robot voting: Protected by velocity rate limiters and device footprint checks.</li>
            <li>Cryptographic transaction idempotency prevents duplicate vote ingestion for identical payment references.</li>
            <li>All vote transactions are irreversibly stamped with UTC epoch timestamps.</li>
          </ul>
        </div>
      </section>

      {/* Section 2: No Refunds & Finality */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F2A01F]" />
          <h2 className="font-serif font-bold text-xl text-[#0B0B0B]">
            2. Payment Finality & Non-Refundability Policy
          </h2>
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed">
          Because public votes immediately impact dynamic real-time leaderboards, verified vote transactions are final and non-refundable once the ballot ledger has processed the payment webhook, except in rare events of verified dual-billing confirmed by our financial desk.
        </p>
      </section>

      {/* Section 3: Privacy & Data Protection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#E8471C]" />
          <h2 className="font-serif font-bold text-xl text-[#0B0B0B]">
            3. Privacy Policy & Data Protection (NDPR / GDPR Compliant)
          </h2>
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed">
          We collect voter full names, email addresses, and phone numbers strictly for issuing digital receipts, auditing ballot authenticity, and preventing bot farm manipulation. We never sell or transfer your personal contact data to third-party marketing companies. Financial card numbers are processed directly within PCI-DSS Level 1 compliant gateway modals and never touch our servers.
        </p>
      </section>
    </div>
  );
};
