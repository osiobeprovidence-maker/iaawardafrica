import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteContent } from '../../types';
import { MediaUpload } from '../common/MediaUpload';
import { AdminSeoSettings } from './AdminSeoSettings';
import {
  Settings,
  Image as ImageIcon,
  Palette,
  Type,
  FileText,
  Lock,
  Mail,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Eye,
  RefreshCw,
  Globe,
  UploadCloud,
  Layers,
  Phone,
  MapPin,
  Share2,
  Award,
  ChevronRight,
  ShieldCheck,
  Sliders,
  ExternalLink,
  Sun,
  Moon,
  Contrast,
  Check
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { currency, setCurrency, siteContent, updateSiteContent, editions, themeMode, setThemeMode, toggleThemeMode } = useApp();
  const [successMsg, setSuccessMsg] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'branding' | 'writeups' | 'gateways' | 'seo' | 'preview'>('branding');

  // Local form state for siteContent
  const [formData, setFormData] = useState<SiteContent>({ ...siteContent, themeMode: siteContent.themeMode || themeMode || 'light' });

  // Keep form in sync if siteContent changes externally
  useEffect(() => {
    setFormData({ ...siteContent, themeMode: siteContent.themeMode || themeMode || 'light' });
  }, [siteContent, themeMode]);

  const currentEdition = editions.find(e => e.isCurrent) || editions[0];

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(formData);
    setSuccessMsg('System branding, cosmetics, and page copy updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset branding, cosmetics, and write-ups back to default configuration?')) {
      const defaultState = {
        ...formData,
        themeMode: 'light' as const,
        brandName: 'Iconic Awards Africa',
        tagline: 'The Continental Crown of African Culture & Haute Couture',
        logoUrl: '/iaa-logo.svg',
        logoHeight: 48,
        faviconUrl: '/iaa-logo.svg',
        primaryColor: '#E8471C',
        goldAccent: '#C9971C',
        darkBg: '#0B0B0B',
        announcementText: 'VOTING IS OFFICIALLY LIVE FOR THE 7TH EDITION • GALA NIGHT TAKES PLACE NOV 28, 2026 IN LAGOS',
        announcementActive: true,
        heroBadge: 'The 7th Edition · African Cultural Fashion & Honors Gala',
        heroHeading: 'Celebrating the Icons Shaping African Culture & Global Couture',
        heroSubheading: 'Iconic Awards Africa (IAA) 7th Edition celebrates visionary designers, cultural leaders, music ambassadors, and cinematic legends redefining African excellence.',
        heroBannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
        heroPrimaryCtaText: 'Vote For Your Icons Now',
        heroSecondaryCtaText: 'Reserve Gala Night Tickets',
        aboutSubtitle: 'Institutional Heritage',
        aboutHeadline: 'Crowning African Cultural Excellence Since 2020',
        aboutStory: 'Founded to honor the indomitable soul and aesthetic ingenuity of the African continent, Iconic Awards Africa (IAA) stands as the definitive continental honors stage. Each year, millions of cultural enthusiasts cast verified votes to crown visionaries whose works command international respect while remaining rooted in ancestral heritage.',
        aboutMission: 'To preserve, elevate, and institutionalize African creative brilliance through world-class recognition, ethical voting transparency, and cultural preservation.',
        aboutVision: 'A united, prosperous creative Africa where indigenous artisans, high-fashion houses, and performing icons dictate global cultural narratives.',
        aboutBannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
        footerDescription: 'Iconic Awards Africa (IAA) is the continent’s premier cultural honors institution celebrating extraordinary African excellence across haute couture fashion, arts, entertainment, and transformative leadership.',
        copyrightText: '© 2026 Iconic Awards Africa (IAA) Secretariat. All Rights Reserved.',
        votingGuidelinesText: 'Every vote cast is cryptographically recorded with cryptographic receipt hash, voter IP verification, and audited ledger reconciliation.',
        contactEmail: 'secretariat@iconicawardsafrica.com',
        contactPhone: '+234 (0) 1 888 4220 / +234 (0) 803 999 IAA1',
        contactAddress: 'IAA Secretariat, Penthouse Floor, Landmark Towers, Water Corporation Road, Victoria Island, Lagos, Nigeria'
      };
      setFormData(defaultState);
      updateSiteContent(defaultState);
      setSuccessMsg('Branding reset to official defaults!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Color Swatch Palettes
  const primaryColorPresets = [
    { name: 'African Terracotta (Default)', hex: '#E8471C' },
    { name: 'Imperial Gold Flame', hex: '#D97706' },
    { name: 'Royal Crimson', hex: '#DC2626' },
    { name: 'Sahara Ochre', hex: '#CA8A04' },
    { name: 'Continental Emerald', hex: '#059669' },
    { name: 'Majestic Purple', hex: '#7C3AED' },
  ];

  const goldColorPresets = [
    { name: '24k Gold (Default)', hex: '#C9971C' },
    { name: 'Sahara Sun', hex: '#F2A01F' },
    { name: 'Bright Ochre', hex: '#E2B142' },
    { name: 'Rose Gold Metallic', hex: '#E08D79' },
    { name: 'Platinum Silver', hex: '#94A3B8' },
  ];

  const darkBgPresets = [
    { name: 'Deep Void Black (Default)', hex: '#0B0B0B' },
    { name: 'Obsidian Velvet', hex: '#141414' },
    { name: 'Midnight Charcoal', hex: '#18181B' },
    { name: 'Royal Navy Slate', hex: '#0F172A' },
  ];

  // Banner Presets
  const bannerPresets = [
    {
      name: 'Gala Night Red Carpet Ballroom',
      url: '/src/assets/images/iaa_hero_gala_1790253803537.jpg'
    },
    {
      name: 'African Cultural Runway Stage',
      url: '/src/assets/images/nominee_fashion_designer_1790253812536.jpg'
    },
    {
      name: 'Luminous Gold Honours Podium',
      url: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8471C]/15 border border-[#E8471C]/30 text-[#E8471C] text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-3 h-3" />
            <span>Master Administration Suite</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#0B0B0B]">
            System Settings, Branding & Page Copy
          </h2>
          <p className="text-xs text-neutral-500">
            Customize the official institution logo, theme cosmetics, page headlines, story narratives, and payment gateways in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{successMsg}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'branding', label: 'Logo, Brand & Cosmetics', icon: Palette },
          { id: 'writeups', label: 'Important Pages Write-ups', icon: FileText },
          { id: 'gateways', label: 'Gateways, Receipts & Currencies', icon: Lock },
          { id: 'seo', label: 'SEO & Social Meta', icon: Globe },
          { id: 'preview', label: 'Live Theme & Brand Preview', icon: Eye },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold whitespace-nowrap transition-all border-b-2 -mb-px rounded-t-lg cursor-pointer ${
                isActive
                  ? 'border-[#E8471C] text-[#E8471C] bg-orange-50/50'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          SUBTAB 1: LOGO, BRAND IDENTITY & COSMETICS
      ======================================================== */}
      {activeSubTab === 'branding' && (
        <form onSubmit={handleSaveAll} className="space-y-8 text-xs">
          {/* Official Logo Section */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E8471C]/10 text-[#E8471C] flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Official Institution Logo</h4>
                  <p className="text-[11px] text-neutral-500">Rendered in the header navigation, footer, receipts, and gala passes.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Form Inputs */}
              <div className="lg:col-span-7 space-y-4">
                <MediaUpload
                  label="Official Institution Logo File"
                  helperText="Upload your real vector SVG or transparent PNG/WebP brand logo file directly from your computer or phone."
                  value={formData.logoUrl}
                  onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  mediaType="image"
                  aspectRatio="auto"
                  presets={[
                    {
                      label: '🏆 Official Gold IAA Emblem',
                      url: '/iaa-logo.svg',
                      description: 'Vector SVG master insignia'
                    },
                    {
                      label: '✨ Gold Star Honors Insignia',
                      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
                      description: 'Prestige star medallion'
                    }
                  ]}
                />

                {/* Logo Height Control */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-neutral-700">Logo Display Height</label>
                    <span className="font-mono text-xs text-[#E8471C] font-bold">
                      {formData.logoHeight || 48}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={32}
                    max={72}
                    step={2}
                    value={formData.logoHeight || 48}
                    onChange={e => setFormData({ ...formData, logoHeight: Number(e.target.value) })}
                    className="w-full accent-[#E8471C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>Compact (32px)</span>
                    <span>Standard (48px)</span>
                    <span>Prominent (72px)</span>
                  </div>
                </div>
              </div>

              {/* Right Logo Live Preview Card */}
              <div className="lg:col-span-5 bg-[#0B0B0B] p-5 rounded-xl border border-neutral-800 space-y-3 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F2A01F] block">
                  Header & Applet Preview
                </span>
                <div className="p-4 bg-black/80 rounded-lg border border-white/10 flex items-center justify-center min-h-[90px]">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt={formData.brandName}
                      style={{ height: `${formData.logoHeight || 48}px` }}
                      className="w-auto max-h-16 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="font-serif font-bold text-lg text-white">{formData.brandName}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 text-center font-light">
                  How your uploaded logo renders across the public navbar and voting headers.
                </p>
              </div>
            </div>
          </div>

          {/* Brand Identity & Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-[#C9971C]/10 text-[#C9971C] flex items-center justify-center">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Brand Identity & Wordmarks</h4>
                <p className="text-[11px] text-neutral-500">Official name and continental motto across the ecosystem.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Official Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName || ''}
                  onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="Iconic Awards Africa"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs font-serif font-bold text-neutral-900 focus:ring-2 focus:ring-[#E8471C]/30 focus:border-[#E8471C] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Continental Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="The Continental Crown of African Culture & Haute Couture"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:ring-2 focus:ring-[#E8471C]/30 focus:border-[#E8471C] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Display Theme Mode Toggle (Light Mode vs High-Contrast Dark Mode) */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Contrast className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Display Theme & High-Contrast Mode</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      WCAG AAA Compliant
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Switch the visual theme between standard ivory light mode and a high-contrast dark mode for low-light legibility and accessibility.
                  </p>
                </div>
              </div>

              {/* Quick Toggle Switch */}
              <div className="flex items-center gap-3 bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, themeMode: 'light' });
                    setThemeMode('light');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    (formData.themeMode || themeMode) === 'light'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, themeMode: 'dark' });
                    setThemeMode('dark');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    (formData.themeMode || themeMode) === 'dark'
                      ? 'bg-[#0B0B0B] text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#F2A01F]" />
                  <span>High-Contrast Dark</span>
                </button>
              </div>
            </div>

            {/* Visual Theme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Light Mode Option Card */}
              <div
                onClick={() => {
                  setFormData({ ...formData, themeMode: 'light' });
                  setThemeMode('light');
                }}
                className={`relative rounded-xl p-5 border-2 transition-all cursor-pointer overflow-hidden ${
                  (formData.themeMode || themeMode) === 'light'
                    ? 'border-[#E8471C] bg-[#FAF8F4]/80 shadow-md ring-2 ring-[#E8471C]/20'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-serif font-bold text-sm text-[#0B0B0B]">Light Sand Mode</h5>
                      <span className="text-[10px] text-neutral-500 block">Editorial Ivory & Terracotta</span>
                    </div>
                  </div>
                  {(formData.themeMode || themeMode) === 'light' ? (
                    <span className="px-2 py-0.5 bg-[#E8471C] text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-700">Select</span>
                  )}
                </div>

                {/* Mini Preview UI */}
                <div className="bg-[#FAF8F4] p-3 rounded-lg border border-neutral-300 space-y-2 mb-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
                    <span className="font-serif font-bold text-xs text-[#0B0B0B]">Iconic Awards Africa</span>
                    <span className="w-2 h-2 rounded-full bg-[#E8471C]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#E8471C] text-white text-[9px] font-bold rounded">Vote Now</span>
                    <span className="text-[10px] text-neutral-600 font-medium">₦100 / Vote</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-600 leading-relaxed font-light">
                  Warm ivory sand canvas with high-legibility dark charcoal typography and terracotta warmth. Best for daytime ambient viewing.
                </p>
              </div>

              {/* High-Contrast Dark Mode Option Card */}
              <div
                onClick={() => {
                  setFormData({ ...formData, themeMode: 'dark' });
                  setThemeMode('dark');
                }}
                className={`relative rounded-xl p-5 border-2 transition-all cursor-pointer overflow-hidden ${
                  (formData.themeMode || themeMode) === 'dark'
                    ? 'border-[#F2A01F] bg-[#0B0B0B] text-white shadow-xl ring-2 ring-[#F2A01F]/30'
                    : 'border-neutral-200 bg-[#121214] text-neutral-200 hover:border-neutral-700 opacity-90'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-yellow-500/20 text-[#F2A01F] flex items-center justify-center border border-[#F2A01F]/30">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-serif font-bold text-sm text-white">High-Contrast Dark Mode</h5>
                      <span className="text-[10px] text-[#F2A01F] block">Obsidian Canvas & 24k Gold</span>
                    </div>
                  </div>
                  {(formData.themeMode || themeMode) === 'dark' ? (
                    <span className="px-2 py-0.5 bg-[#F2A01F] text-black text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3 text-black" /> Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-neutral-400 hover:text-white">Select</span>
                  )}
                </div>

                {/* Mini Preview UI */}
                <div className="bg-[#000000] p-3 rounded-lg border border-[#F2A01F]/40 space-y-2 mb-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/15">
                    <span className="font-serif font-bold text-xs text-white">Iconic Awards Africa</span>
                    <span className="w-2 h-2 rounded-full bg-[#F2A01F] animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#E8471C] text-white text-[9px] font-bold rounded shadow">Vote Now</span>
                    <span className="text-[10px] text-[#F2A01F] font-bold">₦100 / Vote · Live</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 leading-relaxed font-light">
                  Deep obsidian canvas (#070707) with luminous 24k gold accents, crisp pure-white text, and &gt;7:1 contrast ratio. Perfect for gala nights and low-light battery conservation.
                </p>
              </div>
            </div>
          </div>

          {/* Theme Cosmetics & Color Palette */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-[#E8471C]/10 text-[#E8471C] flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Theme Cosmetics & Color Accents</h4>
                <p className="text-[11px] text-neutral-500">African palette harmonizing terracotta warmth, 24k gold prestige, and obsidian backdrops.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Terracotta / Action Color */}
              <div className="space-y-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="block font-bold text-neutral-800 text-xs">Primary Brand Accent</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor || '#E8471C'}
                    onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-neutral-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#E8471C'}
                    onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-mono text-xs uppercase"
                  />
                </div>
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500 font-semibold block">Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryColorPresets.map(preset => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, primaryColor: preset.hex })}
                        title={preset.name}
                        className="w-6 h-6 rounded-md border border-neutral-300 shadow-xs cursor-pointer transition-transform hover:scale-110"
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Gold Accent */}
              <div className="space-y-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="block font-bold text-neutral-800 text-xs">24k Gold Prestige Accent</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.goldAccent || '#C9971C'}
                    onChange={e => setFormData({ ...formData, goldAccent: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-neutral-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.goldAccent || '#C9971C'}
                    onChange={e => setFormData({ ...formData, goldAccent: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-mono text-xs uppercase"
                  />
                </div>
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500 font-semibold block">Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {goldColorPresets.map(preset => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, goldAccent: preset.hex })}
                        title={preset.name}
                        className="w-6 h-6 rounded-md border border-neutral-300 shadow-xs cursor-pointer transition-transform hover:scale-110"
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Dark Canvas */}
              <div className="space-y-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="block font-bold text-neutral-800 text-xs">Dark Canvas Theme</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.darkBg || '#0B0B0B'}
                    onChange={e => setFormData({ ...formData, darkBg: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-neutral-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.darkBg || '#0B0B0B'}
                    onChange={e => setFormData({ ...formData, darkBg: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-mono text-xs uppercase"
                  />
                </div>
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-neutral-500 font-semibold block">Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {darkBgPresets.map(preset => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, darkBg: preset.hex })}
                        title={preset.name}
                        className="w-6 h-6 rounded-md border border-neutral-300 shadow-xs cursor-pointer transition-transform hover:scale-110"
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Branding & Cosmetics</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          SUBTAB 2: IMPORTANT PAGES WRITE-UPS & COPY
      ======================================================== */}
      {activeSubTab === 'writeups' && (
        <form onSubmit={handleSaveAll} className="space-y-8 text-xs">
          {/* Top Announcement Bar Copy */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#E8471C] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Top Announcement Strip</h4>
                  <p className="text-[11px] text-neutral-500">Pinned at the very top of all public pages for breaking gala alerts.</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                <input
                  type="checkbox"
                  checked={formData.announcementActive}
                  onChange={e => setFormData({ ...formData, announcementActive: e.target.checked })}
                  className="rounded text-[#E8471C] focus:ring-[#E8471C]"
                />
                <span className="font-bold text-neutral-800">Banner Enabled</span>
              </label>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Announcement Text</label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:ring-2 focus:ring-[#E8471C]/30 focus:border-[#E8471C] outline-none"
              />
            </div>
          </div>

          {/* Homepage Hero Section Write-ups */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-[#C9971C]/10 text-[#C9971C] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Homepage Hero Section Write-up</h4>
                <p className="text-[11px] text-neutral-500">The premier visual and textual message welcoming continental visitors.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Hero Edition Badge / Pill</label>
                <input
                  type="text"
                  value={formData.heroBadge || ''}
                  onChange={e => setFormData({ ...formData, heroBadge: e.target.value })}
                  placeholder="The 7th Edition · African Cultural Fashion & Honors Gala"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#E8471C]/30 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={formData.heroPrimaryCtaText || ''}
                  onChange={e => setFormData({ ...formData, heroPrimaryCtaText: e.target.value })}
                  placeholder="Vote For Your Icons Now"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#E8471C]/30 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Main Display Headline</label>
              <input
                type="text"
                value={formData.heroHeading}
                onChange={e => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm font-serif font-bold text-neutral-900 focus:ring-2 focus:ring-[#E8471C]/30 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Hero Subheading Narrative</label>
              <textarea
                rows={3}
                value={formData.heroSubheading}
                onChange={e => setFormData({ ...formData, heroSubheading: e.target.value })}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:ring-2 focus:ring-[#E8471C]/30 outline-none"
              />
            </div>

            <div>
              <MediaUpload
                label="Hero Backdrop Banner Image"
                helperText="Upload your real high-resolution event stage or gala background photo. Supported formats: JPG, PNG, WebP."
                value={formData.heroBannerImage || ''}
                onChange={(url) => setFormData({ ...formData, heroBannerImage: url })}
                aspectRatio="21:9"
                presets={bannerPresets.map(b => ({
                  label: b.name,
                  url: b.url,
                  description: 'High-res gala photography asset'
                }))}
              />
            </div>
          </div>

          {/* About Page Institutional Narratives */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">About Page Heritage & Narratives</h4>
                <p className="text-[11px] text-neutral-500">Mission, founding history, and institutional credentials.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">About Section Subtitle / Kicker</label>
                <input
                  type="text"
                  value={formData.aboutSubtitle || ''}
                  onChange={e => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                  placeholder="Institutional Heritage"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">About Page Headline</label>
                <input
                  type="text"
                  value={formData.aboutHeadline || ''}
                  onChange={e => setFormData({ ...formData, aboutHeadline: e.target.value })}
                  placeholder="Crowning African Cultural Excellence Since 2020"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs font-serif font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Our Founding Story Narrative</label>
              <textarea
                rows={4}
                value={formData.aboutStory}
                onChange={e => setFormData({ ...formData, aboutStory: e.target.value })}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Our Mission Statement</label>
                <textarea
                  rows={3}
                  value={formData.aboutMission}
                  onChange={e => setFormData({ ...formData, aboutMission: e.target.value })}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Our Continental Vision</label>
                <textarea
                  rows={3}
                  value={formData.aboutVision}
                  onChange={e => setFormData({ ...formData, aboutVision: e.target.value })}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer, Legal & Secretariat Contacts */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Footer Write-up & Official Secretariat Contacts</h4>
                <p className="text-[11px] text-neutral-500">Public contact channels, headquarters address, and footer bio.</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Footer Institutional Bio Statement</label>
              <textarea
                rows={2}
                value={formData.footerDescription || ''}
                onChange={e => setFormData({ ...formData, footerDescription: e.target.value })}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Secretariat Official Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Official Hotlines & Phone Numbers</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Headquarters Physical Address</label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={e => setFormData({ ...formData, contactAddress: e.target.value })}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Copyright Statement</label>
                <input
                  type="text"
                  value={formData.copyrightText || ''}
                  onChange={e => setFormData({ ...formData, copyrightText: e.target.value })}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Audit Ledger Disclaimer Note</label>
                <input
                  type="text"
                  value={formData.votingGuidelinesText || ''}
                  onChange={e => setFormData({ ...formData, votingGuidelinesText: e.target.value })}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Social Media Handles & Links</h4>
                <p className="text-[11px] text-neutral-500">Connected public channels in the footer and share dialogs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={e => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                  })}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">X / Twitter URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.twitter}
                  onChange={e => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                  })}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.facebook}
                  onChange={e => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                  })}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">TikTok URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.tiktok}
                  onChange={e => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, tiktok: e.target.value }
                  })}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.youtube}
                  onChange={e => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                  })}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">WhatsApp Community URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.whatsapp}
                  onChange={e => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, whatsapp: e.target.value }
                  })}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Page Write-ups & Copy</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          SUBTAB 3: GATEWAYS, RECEIPTS & CURRENCIES
      ======================================================== */}
      {activeSubTab === 'gateways' && (
        <form onSubmit={handleSaveAll} className="space-y-8 text-xs">
          {/* Payment Gateways */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Lock className="w-4 h-4 text-[#E8471C]" />
              <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Payment Gateway API Keys</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Paystack Public Key</label>
                <input
                  type="text"
                  value={formData.paystackPublicKey}
                  onChange={e => setFormData({ ...formData, paystackPublicKey: e.target.value })}
                  className="w-full border rounded p-2.5 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Paystack Secret Key</label>
                <input
                  type="password"
                  value={formData.paystackSecretKey || ''}
                  onChange={e => setFormData({ ...formData, paystackSecretKey: e.target.value })}
                  className="w-full border rounded p-2.5 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Flutterwave Public Key</label>
                <input
                  type="text"
                  value={formData.flutterwavePublicKey}
                  onChange={e => setFormData({ ...formData, flutterwavePublicKey: e.target.value })}
                  className="w-full border rounded p-2.5 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Flutterwave Secret Key</label>
                <input
                  type="password"
                  value={formData.flutterwaveSecretKey || ''}
                  onChange={e => setFormData({ ...formData, flutterwaveSecretKey: e.target.value })}
                  className="w-full border rounded p-2.5 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Email & Receipt Template */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Mail className="w-4 h-4 text-[#E8471C]" />
              <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Automated Voter Receipt Delivery Headers</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Sender Organization Name</label>
                <input
                  type="text"
                  value={formData.emailSenderName || ''}
                  onChange={e => setFormData({ ...formData, emailSenderName: e.target.value })}
                  placeholder="Iconic Awards Africa Secretariat"
                  className="w-full border rounded p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-600 mb-1">From Email Address</label>
                <input
                  type="email"
                  value={formData.emailSenderAddress || ''}
                  onChange={e => setFormData({ ...formData, emailSenderAddress: e.target.value })}
                  placeholder="ballot-receipts@iconicawardsafrica.com"
                  className="w-full border rounded p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Currency Defaults */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <DollarSign className="w-4 h-4 text-[#E8471C]" />
              <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Default Display Currency</h4>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <input
                  type="radio"
                  name="currency"
                  checked={currency === 'NGN'}
                  onChange={() => setCurrency('NGN')}
                  className="text-[#E8471C]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">Nigerian Naira (₦ NGN)</span>
                  <span className="text-[10px] text-neutral-500">Primary for West African ballot voters</span>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <input
                  type="radio"
                  name="currency"
                  checked={currency === 'USD'}
                  onChange={() => setCurrency('USD')}
                  className="text-[#E8471C]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">US Dollar ($ USD)</span>
                  <span className="text-[10px] text-neutral-500">Continental Africa & Global Diaspora</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Infrastructure Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          SUBTAB 4: SEO, SEARCH ENGINE & SOCIAL META
      ======================================================== */}
      {activeSubTab === 'seo' && <AdminSeoSettings />}

      {/* ========================================================
          SUBTAB 5: LIVE THEME & BRAND PREVIEW
      ======================================================== */}
      {activeSubTab === 'preview' && (
        <div className="space-y-6 text-xs">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#0B0B0B]">Real-Time Cosmetics & Brand Simulator</h4>
                <p className="text-xs text-neutral-500">Preview your configured logo, typography, and palette as they appear in both Light and High-Contrast Dark modes.</p>
              </div>

              {/* Preview Mode Switcher */}
              <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, themeMode: 'light' });
                    setThemeMode('light');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    (formData.themeMode || themeMode) === 'light'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Canvas</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, themeMode: 'dark' });
                    setThemeMode('dark');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    (formData.themeMode || themeMode) === 'dark'
                      ? 'bg-[#0B0B0B] text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#F2A01F]" />
                  <span>High-Contrast Dark</span>
                </button>
              </div>
            </div>

            {/* Mock Navigation Header */}
            <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-xl">
              {/* Top Announcement Bar */}
              {formData.announcementActive && (
                <div
                  className="text-white text-[11px] font-semibold py-1.5 px-4 text-center"
                  style={{ backgroundColor: formData.primaryColor || '#E8471C' }}
                >
                  <span>{formData.announcementText}</span>
                </div>
              )}

              {/* Main Navbar */}
              <div
                className="px-6 py-4 flex items-center justify-between border-b border-white/10"
                style={{ backgroundColor: formData.darkBg || '#0B0B0B' }}
              >
                <div className="flex items-center gap-3">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt={formData.brandName}
                      style={{ height: `${formData.logoHeight || 48}px` }}
                      className="w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                      }}
                    />
                  ) : (
                    <span className="font-serif font-bold text-white text-lg">{formData.brandName}</span>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-4 text-neutral-300 font-medium">
                  <span className="text-white font-bold">Home</span>
                  <span>Nominees</span>
                  <span>Categories</span>
                  <span>Leaderboard</span>
                  <span>Tickets</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    style={{ backgroundColor: formData.primaryColor || '#E8471C' }}
                    className="px-4 py-2 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow"
                  >
                    Vote Now
                  </button>
                </div>
              </div>

              {/* Mock Hero Showcase */}
              <div
                className="p-8 sm:p-12 relative overflow-hidden text-white"
                style={{ backgroundColor: formData.darkBg || '#0B0B0B' }}
              >
                <div className="max-w-2xl space-y-4 relative z-10">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold border"
                    style={{
                      borderColor: `${formData.primaryColor || '#E8471C'}60`,
                      backgroundColor: `${formData.primaryColor || '#E8471C'}20`,
                      color: formData.goldAccent || '#F2A01F'
                    }}
                  >
                    <span>{formData.heroBadge || currentEdition.theme}</span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                    {formData.heroHeading}
                  </h1>

                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
                    {formData.heroSubheading}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      style={{ backgroundColor: formData.primaryColor || '#E8471C' }}
                      className="px-5 py-2.5 text-white font-bold uppercase rounded-md text-xs"
                    >
                      {formData.heroPrimaryCtaText || 'Vote For Your Icons Now'}
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-bold uppercase rounded-md text-xs"
                    >
                      {formData.heroSecondaryCtaText || 'Reserve Gala Night Tickets'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-6 py-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply & Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
