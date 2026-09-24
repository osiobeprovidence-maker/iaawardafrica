import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';

export const ContactFAQPage: React.FC = () => {
  const { siteContent, faqs } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email) {
      setSent(true);
      setTimeout(() => {
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5 text-[#F2A01F]" />
          <span>Support & Clarifications</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
          Frequently Asked Questions & Secretariat Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          Everything you need to know about voting validity, gateway security, gala admission, and contacting the Iconic Awards Africa Academy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* FAQs Accordion */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#0B0B0B] mb-2">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-serif font-bold text-sm text-[#0B0B0B]">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#E8471C] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form & Offices */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B0B0B] text-white p-6 sm:p-8 rounded-2xl border border-[#C9971C]/30 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#F2A01F] tracking-widest block">
                IAA Secretariat & Jury Bureau
              </span>
              <h3 className="font-serif font-bold text-xl text-white mt-1">
                Reach the Academy
              </h3>
            </div>

            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9971C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Continental Headquarters</strong>
                  <span>{siteContent.contactAddress || 'Plot 12, Victoria Island Arts Corridor, Lagos, Nigeria'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9971C] shrink-0" />
                <span>{siteContent.contactEmail}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C9971C] shrink-0" />
                <span>{siteContent.contactPhone}</span>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="pt-4 border-t border-white/10">
              {sent ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-lg text-center text-xs text-emerald-300">
                  ✓ Message transmitted to the Secretariat. We respond within 12 business hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full bg-[#181818] border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#E8471C]"
                  />
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full bg-[#181818] border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#E8471C]"
                  />
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Subject (e.g. Nomination Inquiry, Ballot Support)"
                    className="w-full bg-[#181818] border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#E8471C]"
                  />
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Your message..."
                    className="w-full bg-[#181818] border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#E8471C]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transmit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
