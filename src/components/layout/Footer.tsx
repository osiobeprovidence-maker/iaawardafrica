import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Award,
  ArrowRight,
  Shield,
  Heart
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { siteContent, editions } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const currentEdition = editions.find(e => e.isCurrent) || editions[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const navTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0B0B] text-[#FAF8F4] relative overflow-hidden">
      {/* Top Kente Accent Stripe */}
      <div className="h-1.5 w-full kente-stripe opacity-90" />

      {/* African pattern backdrop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {siteContent.logoUrl ? (
                <img
                  src={siteContent.logoUrl}
                  alt={siteContent.brandName || "Iconic Awards Africa"}
                  style={{ height: `${siteContent.logoHeight || 48}px` }}
                  className="w-auto max-h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E8471C] to-[#C9971C] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
                    IAA
                  </div>
                  <span className="font-serif font-bold text-white text-lg tracking-tight">
                    {siteContent.brandName || 'Iconic Awards Africa'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-[#FAF8F4]/70 leading-relaxed max-w-sm">
              {siteContent.footerDescription || 'Iconic Awards Africa (IAA) is the continent’s premier cultural honors institution celebrating extraordinary African excellence across haute couture fashion, arts, entertainment, and transformative leadership.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F2A01F]">
              <Award className="w-4 h-4 text-[#E8471C]" />
              <span className="font-semibold">{currentEdition.name}:</span>
              <span className="text-[#FAF8F4]/80 italic font-serif">{currentEdition.theme}</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#FAF8F4]/50 font-semibold block mb-2.5">
                Connect With Us Across Africa
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={siteContent.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#E8471C] text-[#FAF8F4]/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={siteContent.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#E8471C] text-[#FAF8F4]/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={siteContent.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#E8471C] text-[#FAF8F4]/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={siteContent.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-white/5 hover:bg-[#E8471C] text-[#FAF8F4]/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={siteContent.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-white/5 hover:bg-emerald-600 text-[#FAF8F4]/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="WhatsApp"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#F2A01F] font-bold">Awards & Voting</h4>
            <ul className="space-y-2 text-xs text-[#FAF8F4]/70">
              <li>
                <button onClick={() => navTo('my-votes')} className="hover:text-[#E8471C] transition-colors font-semibold text-[#F2A01F]">
                  My Votes & Receipts
                </button>
              </li>
              <li>
                <button onClick={() => navTo('nominees')} className="hover:text-[#E8471C] transition-colors">
                  Browse Nominees
                </button>
              </li>
              <li>
                <button onClick={() => navTo('categories')} className="hover:text-[#E8471C] transition-colors">
                  Award Categories
                </button>
              </li>
              <li>
                <button onClick={() => navTo('leaderboard')} className="hover:text-[#E8471C] transition-colors">
                  Live Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => navTo('events')} className="hover:text-[#E8471C] transition-colors">
                  Gala Events & Schedule
                </button>
              </li>
              <li>
                <button onClick={() => navTo('tickets')} className="hover:text-[#E8471C] transition-colors">
                  Gala Night Tickets
                </button>
              </li>
              <li>
                <button onClick={() => navTo('past-editions')} className="hover:text-[#E8471C] transition-colors">
                  Past Editions Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Organization & Support */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#F2A01F] font-bold">About IAA</h4>
            <ul className="space-y-2 text-xs text-[#FAF8F4]/70">
              <li>
                <button onClick={() => navTo('about')} className="hover:text-[#E8471C] transition-colors">
                  Our Story & Mission
                </button>
              </li>
              <li>
                <button onClick={() => navTo('gallery')} className="hover:text-[#E8471C] transition-colors">
                  Photo & Video Gallery
                </button>
              </li>
              <li>
                <button onClick={() => navTo('sponsors')} className="hover:text-[#E8471C] transition-colors">
                  Sponsors & Partners
                </button>
              </li>
              <li>
                <button onClick={() => navTo('contact-faq')} className="hover:text-[#E8471C] transition-colors">
                  FAQs & Contact
                </button>
              </li>
              <li>
                <button onClick={() => navTo('legal')} className="hover:text-[#E8471C] transition-colors">
                  Voting Rules & Terms
                </button>
              </li>
              <li>
                <button onClick={() => navTo('admin')} className="hover:text-[#C9971C] text-[#C9971C]/90 font-medium transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#F2A01F] font-bold">Stay Informed</h4>
            <p className="text-xs text-[#FAF8F4]/70">
              Receive breaking winner announcements, red carpet credentials, and exclusive ticket alerts.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#181818] border border-white/15 rounded-md px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E8471C]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#E8471C] hover:bg-[#c93912] text-white rounded text-xs flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ Thank you for subscribing to Iconic Awards Africa!
                </p>
              )}
            </form>

            <div className="pt-2 text-[11px] text-[#FAF8F4]/60 space-y-1">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9971C] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{siteContent.contactAddress || 'Lagos, Nigeria · Accra, Ghana'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C9971C] shrink-0" />
                <span>{siteContent.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F4]/50">
          <p>{siteContent.copyrightText || `© ${new Date().getFullYear()} Iconic Awards Africa (IAA). All rights reserved.`}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navTo('legal')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => navTo('legal')} className="hover:text-white transition-colors">
              Terms of Voting
            </button>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#F2A01F]">
              Crafted with <Heart className="w-3 h-3 text-[#E8471C] fill-[#E8471C]" /> for Africa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
