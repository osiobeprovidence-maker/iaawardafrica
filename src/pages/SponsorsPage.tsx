import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Send,
  Building,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const SponsorsPage: React.FC = () => {
  const { sponsors } = useApp();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    tierInterest: 'category',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName && formData.email) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          tierInterest: 'category',
          message: ''
        });
      }, 4000);
    }
  };

  const headlineSponsors = sponsors.filter(s => s.tier === 'headline');
  const platinumSponsors = sponsors.filter(s => s.tier === 'platinum');
  const otherSponsors = sponsors.filter(s => s.tier !== 'headline' && s.tier !== 'platinum');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
          <Award className="w-3.5 h-3.5 text-[#F2A01F]" />
          <span>Strategic Partnerships</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B0B0B]">
          Powering the African Cultural Renaissance
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          Iconic Awards Africa partners with visionary institutions committed to fostering creative industries, cultural heritage preservation, and pan-African economic excellence.
        </p>
      </div>

      {/* Sponsors by Tier */}
      <div className="space-y-10">
        {/* Headline Tier */}
        {headlineSponsors.length > 0 && (
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#F2A01F] block">
              Official Headline Partner
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {headlineSponsors.map(sponsor => (
                <div
                  key={sponsor.id}
                  className="bg-[#0B0B0B] text-white p-6 sm:p-8 rounded-2xl border border-[#C9971C]/50 shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8471C]">
                      Headline Banking & Growth Partner
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-white">
                      {sponsor.name}
                    </h3>
                    <p className="text-xs text-[#FAF8F4]/80 leading-relaxed font-light">
                      {sponsor.description}
                    </p>
                  </div>
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#F2A01F] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    Visit Partner Portal →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platinum Tier */}
        {platinumSponsors.length > 0 && (
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-neutral-500 block">
              Platinum Infrastructure & Payment Partners
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {platinumSponsors.map(sponsor => (
                <div
                  key={sponsor.id}
                  className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#0B0B0B]">
                      {sponsor.name}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {sponsor.description}
                    </p>
                  </div>
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#E8471C] font-semibold hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media & Cultural Partners */}
        {otherSponsors.length > 0 && (
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-neutral-500 block">
              Broadcast, City & Media Partners
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherSponsors.map(sponsor => (
                <div
                  key={sponsor.id}
                  className="bg-white p-4 rounded-lg border border-neutral-200 text-center"
                >
                  <h5 className="font-serif font-bold text-xs text-neutral-900">
                    {sponsor.name}
                  </h5>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mt-0.5">
                    {sponsor.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Become a Sponsor Form */}
      <div className="bg-[#0B0B0B] text-white rounded-2xl p-6 sm:p-10 border border-[#C9971C]/40 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F2A01F]">
              Corporate & Brand Partnerships
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Align Your Brand with Continental Cultural Excellence
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F4]/80 leading-relaxed font-light">
              Position your organization before 1,500 VIP attendees in Lagos, millions of television viewers across 50+ African nations, and digital voters spanning the global diaspora.
            </p>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F2A01F]" />
                <span>Naming rights & exclusive category presentations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F2A01F]" />
                <span>Prime broadcast placements on Arise News & digital media</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F2A01F]" />
                <span>Dedicated VVIP Royal Hospitality Tables</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-[#0B0B0B] p-6 sm:p-8 rounded-xl shadow-md">
            <h3 className="font-serif font-bold text-xl text-[#0B0B0B] mb-4">
              Partnership Inquiry Form
            </h3>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-base text-emerald-900">
                  Partnership Prospectus Dispatched!
                </h4>
                <p className="text-xs text-emerald-700">
                  Our Corporate Partnerships Director will contact your designated representative within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-600 font-bold uppercase tracking-wider mb-1 text-[11px]">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Sterling Africa Capital"
                      className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#E8471C]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 font-bold uppercase tracking-wider mb-1 text-[11px]">
                      Contact Person & Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Funke Johnson, CMO"
                      className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#E8471C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-600 font-bold uppercase tracking-wider mb-1 text-[11px]">
                      Official Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partnerships@brand.com"
                      className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#E8471C]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 font-bold uppercase tracking-wider mb-1 text-[11px]">
                      Direct Telephone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234..."
                      className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#E8471C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-600 font-bold uppercase tracking-wider mb-1 text-[11px]">
                    Sponsorship Tier of Interest
                  </label>
                  <select
                    value={formData.tierInterest}
                    onChange={e => setFormData({ ...formData, tierInterest: e.target.value })}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-[#E8471C]"
                  >
                    <option value="headline">Headline Presenting Partner (Exclusive)</option>
                    <option value="category">Category Naming Partner</option>
                    <option value="runway">Cultural Fashion Runway Sponsor</option>
                    <option value="hospitality">Official Hospitality & VIP Lounge Host</option>
                    <option value="media">Media & Broadcast Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 font-bold uppercase tracking-wider mb-1 text-[11px]">
                    Brief Objectives or Special Inquiries
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your brand alignment goals..."
                    className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#E8471C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Request Official 7th Edition Rate Card & Pack
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
