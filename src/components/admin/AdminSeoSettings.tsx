import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SeoSettings } from '../../types';
import { MediaUpload } from '../common/MediaUpload';
import {
  generateSchemaJsonLd,
  generateSitemapXml,
  generateRobotsTxt,
  DEFAULT_SEO_SETTINGS
} from '../../utils/seoManager';
import {
  Globe,
  Search,
  Share2,
  Code,
  FileCode,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Sparkles,
  Smartphone,
  Monitor,
  RefreshCw,
  Tag,
  Check
} from 'lucide-react';

export const AdminSeoSettings: React.FC = () => {
  const { siteContent, updateSiteContent, editions, events, categories, nominees } = useApp();

  // Initialize SEO state
  const [seoForm, setSeoForm] = useState<SeoSettings>(() => ({
    ...DEFAULT_SEO_SETTINGS,
    ...(siteContent.seo || {})
  }));

  const [activeView, setActiveView] = useState<'meta' | 'social' | 'schema' | 'sitemap'>('meta');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [customJsonError, setCustomJsonError] = useState<string | null>(null);

  // Synchronize when siteContent changes externally
  useEffect(() => {
    if (siteContent.seo) {
      setSeoForm(prev => ({
        ...DEFAULT_SEO_SETTINGS,
        ...siteContent.seo
      }));
    }
  }, [siteContent.seo]);

  const currentEdition = editions.find(e => e.isCurrent) || editions[0];

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If custom schema is chosen, validate JSON
    if (seoForm.schemaType === 'Custom' && seoForm.customJsonLd) {
      try {
        JSON.parse(seoForm.customJsonLd);
        setCustomJsonError(null);
      } catch (err: any) {
        setCustomJsonError('Invalid JSON format in custom Schema.org script.');
        return;
      }
    }

    updateSiteContent({
      ...siteContent,
      seo: seoForm
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXml(seoForm.canonicalUrl, categories, nominees);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadRobots = () => {
    const txt = generateRobotsTxt(seoForm.canonicalUrl, seoForm.robotsDirective);
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToRecommended = () => {
    if (window.confirm('Reset SEO and social sharing tags to official recommended values?')) {
      setSeoForm(DEFAULT_SEO_SETTINGS);
      updateSiteContent({
        ...siteContent,
        seo: DEFAULT_SEO_SETTINGS
      });
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  // Compute live JSON-LD and XML
  const currentSchemaJson = generateSchemaJsonLd(seoForm, siteContent, currentEdition, events);
  const currentSitemapXml = generateSitemapXml(seoForm.canonicalUrl, categories, nominees);
  const currentRobotsTxt = generateRobotsTxt(seoForm.canonicalUrl, seoForm.robotsDirective);

  // Character counter helper
  const titleLength = seoForm.metaTitle?.length || 0;
  const descLength = seoForm.metaDescription?.length || 0;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {saveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>SEO settings updated and synchronized with document head & Schema.org in real time!</span>
        </div>
      )}

      {/* Header Controls */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Globe className="w-3 h-3 text-emerald-600" />
            <span>Search Engine & OpenGraph Control Center</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-neutral-900">
            Real Search Engine Optimization (SEO) & Social Meta
          </h3>
          <p className="text-xs text-neutral-500 font-light">
            Control search ranking metadata, Google SERP cards, social sharing link previews, and Schema.org rich results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToRecommended}
            className="px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recommended Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-neutral-200 bg-white p-1 rounded-xl border">
        {[
          { id: 'meta', label: 'Meta Tags & SERP Preview', icon: Search },
          { id: 'social', label: 'OpenGraph & Twitter Cards', icon: Share2 },
          { id: 'schema', label: 'Schema.org Structured Data (JSON-LD)', icon: Code },
          { id: 'sitemap', label: 'XML Sitemap & robots.txt', icon: FileCode }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0B0B0B] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: SEARCH META TAGS & GOOGLE SERP SIMULATOR
      ======================================================== */}
      {activeView === 'meta' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Inputs */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-sm text-neutral-900 pb-2 border-b border-neutral-100 flex items-center justify-between">
                <span>Search Engine Meta Directives</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Status: Live Head Sync Enabled
                </span>
              </h4>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-neutral-700 text-xs">
                    Page Title (<code className="font-mono text-neutral-500">&lt;title&gt;</code> & SERP Title)
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      titleLength >= 30 && titleLength <= 65
                        ? 'bg-emerald-100 text-emerald-800'
                        : titleLength > 65
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {titleLength} / 60 chars {titleLength >= 30 && titleLength <= 65 ? '(Optimal)' : ''}
                  </span>
                </div>
                <input
                  type="text"
                  value={seoForm.metaTitle}
                  onChange={e => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                  placeholder="Brand Name | Compelling Value Proposition"
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#E8471C] outline-none"
                />
                <p className="text-[10px] text-neutral-400 mt-1 font-light">
                  Google typically displays the first 50–60 characters of a title tag.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-neutral-700 text-xs">
                    Meta Description (<code className="font-mono text-neutral-500">&lt;meta name="description"&gt;</code>)
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      descLength >= 120 && descLength <= 160
                        ? 'bg-emerald-100 text-emerald-800'
                        : descLength > 160
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {descLength} / 160 chars {descLength >= 120 && descLength <= 160 ? '(Optimal)' : ''}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoForm.metaDescription}
                  onChange={e => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                  placeholder="Summarize the core value proposition and call to action..."
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#E8471C] outline-none"
                />
                <p className="text-[10px] text-neutral-400 mt-1 font-light">
                  Keep descriptions between 120 and 160 characters so they are not truncated in search result snippets.
                </p>
              </div>

              {/* Focus Keywords */}
              <div>
                <label className="block font-bold text-neutral-700 text-xs mb-1">
                  Primary Search Keywords & Metadata Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={seoForm.metaKeywords}
                  onChange={e => setSeoForm({ ...seoForm, metaKeywords: e.target.value })}
                  placeholder="Iconic Awards Africa, African Fashion, IAA 2026, Voting..."
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs font-mono text-neutral-800 focus:border-[#E8471C] outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {seoForm.metaKeywords.split(',').map((kw, i) => {
                    const clean = kw.trim();
                    if (!clean) return null;
                    return (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-[10px] text-neutral-700 font-medium">
                        <Tag className="w-2.5 h-2.5 text-[#E8471C]" />
                        {clean}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Canonical URL & Indexing Directives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block font-bold text-neutral-700 text-xs mb-1">
                    Canonical Website Domain URL
                  </label>
                  <input
                    type="text"
                    value={seoForm.canonicalUrl}
                    onChange={e => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                    placeholder="https://iconicawardsafrica.com"
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono text-neutral-800 focus:border-[#E8471C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 text-xs mb-1">
                    Search Engine Crawl Directives (<code className="font-mono text-neutral-500">robots</code>)
                  </label>
                  <select
                    value={seoForm.robotsDirective}
                    onChange={e => setSeoForm({ ...seoForm, robotsDirective: e.target.value as any })}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs bg-white text-neutral-800 focus:border-[#E8471C]"
                  >
                    <option value="index, follow">✅ Index & Follow Links (Production Recommended)</option>
                    <option value="noindex, nofollow">🚫 Noindex, Nofollow (Private / Staging)</option>
                    <option value="noindex, follow">⚠️ Noindex, Follow Links</option>
                    <option value="index, nofollow">⚠️ Index, Nofollow Links</option>
                  </select>
                </div>
              </div>

              {/* Webmaster Verifications */}
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <h5 className="font-bold text-xs text-neutral-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Webmaster Ownership Verification Tokens</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Google Search Console Token
                    </label>
                    <input
                      type="text"
                      value={seoForm.googleSiteVerification || ''}
                      onChange={e => setSeoForm({ ...seoForm, googleSiteVerification: e.target.value })}
                      placeholder="e.g. g_verify_abc123..."
                      className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Bing Webmaster Verification Token
                    </label>
                    <input
                      type="text"
                      value={seoForm.bingSiteVerification || ''}
                      onChange={e => setSeoForm({ ...seoForm, bingSiteVerification: e.target.value })}
                      placeholder="e.g. 789456123..."
                      className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Google SERP Live Simulator */}
            <div className="lg:col-span-5 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-md space-y-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[11px] font-mono font-bold text-neutral-300 ml-2">Google SERP Simulator</span>
                </div>

                <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-[10px]">
                  <button
                    type="button"
                    onClick={() => setSerpDevice('desktop')}
                    className={`px-2 py-1 rounded flex items-center gap-1 ${
                      serpDevice === 'desktop' ? 'bg-white text-black font-bold' : 'text-neutral-400'
                    }`}
                  >
                    <Monitor className="w-3 h-3" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpDevice('mobile')}
                    className={`px-2 py-1 rounded flex items-center gap-1 ${
                      serpDevice === 'mobile' ? 'bg-white text-black font-bold' : 'text-neutral-400'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" /> Mobile
                  </button>
                </div>
              </div>

              {/* Realistic Google Search Card */}
              <div className={`bg-white text-neutral-900 rounded-xl p-4 shadow-sm space-y-1.5 font-sans ${serpDevice === 'mobile' ? 'max-w-xs mx-auto border-2 border-neutral-300' : ''}`}>
                {/* URL Breadcrumb */}
                <div className="flex items-center gap-2 text-[12px] text-neutral-700">
                  <div className="w-6 h-6 rounded-full bg-[#0B0B0B] p-1 flex items-center justify-center shrink-0">
                    <img src="/iaa-logo.svg" alt="Google Favicon" className="w-4 h-4 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold block text-neutral-900 text-xs">Iconic Awards Africa</span>
                    <span className="text-[11px] text-neutral-500 truncate block">
                      {seoForm.canonicalUrl || 'https://iconicawardsafrica.com'}
                    </span>
                  </div>
                </div>

                {/* Blue Search Title */}
                <h3 className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-2 leading-snug">
                  {seoForm.metaTitle || 'Iconic Awards Africa (IAA) | The Continental Crown'}
                </h3>

                {/* Search Snippet */}
                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed font-normal">
                  {seoForm.metaDescription || 'Official platform for Iconic Awards Africa...'}
                </p>

                {/* Sitelinks Extension Simulation */}
                <div className="pt-2 mt-2 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#1a0dab] font-medium block">Categories & Nominees</span>
                    <span className="text-neutral-500 text-[10px]">Vote for African icons</span>
                  </div>
                  <div>
                    <span className="text-[#1a0dab] font-medium block">Gala Night Passes</span>
                    <span className="text-neutral-500 text-[10px]">VIP Ballroom tickets</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-neutral-300 space-y-1">
                <span className="font-bold text-[#F2A01F] block">✓ Real-time Inspection</span>
                <p className="font-light">
                  Changes made here update the live browser title, meta description, and robots instructions immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: OPENGRAPH & TWITTER SOCIAL SHARING CARDS
      ======================================================== */}
      {activeView === 'social' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Social Form Inputs */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-sm text-neutral-900 pb-2 border-b border-neutral-100">
                OpenGraph (Facebook, LinkedIn, WhatsApp) & X (Twitter) Cards
              </h4>

              {/* Social Share Title */}
              <div>
                <label className="block font-bold text-neutral-700 text-xs mb-1">
                  Social Share Title (<code className="font-mono text-neutral-500">og:title</code> / <code className="font-mono text-neutral-500">twitter:title</code>)
                </label>
                <input
                  type="text"
                  value={seoForm.ogTitle}
                  onChange={e => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                  placeholder="Title displayed when shared on WhatsApp, X, Facebook..."
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#E8471C] outline-none"
                />
              </div>

              {/* Social Share Description */}
              <div>
                <label className="block font-bold text-neutral-700 text-xs mb-1">
                  Social Share Summary (<code className="font-mono text-neutral-500">og:description</code> / <code className="font-mono text-neutral-500">twitter:description</code>)
                </label>
                <textarea
                  rows={2}
                  value={seoForm.ogDescription}
                  onChange={e => setSeoForm({ ...seoForm, ogDescription: e.target.value })}
                  placeholder="Summary text beneath social share link..."
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#E8471C] outline-none"
                />
              </div>

              {/* Social Share Image Upload */}
              <div>
                <MediaUpload
                  label="Social Sharing Card Preview Image (og:image & twitter:image)"
                  helperText="Upload a crisp 1200×630px banner image for WhatsApp, iMessage, X, LinkedIn, and Facebook."
                  value={seoForm.ogImageUrl}
                  onChange={(url) => setSeoForm({ ...seoForm, ogImageUrl: url })}
                  aspectRatio="16:9"
                  presets={[
                    {
                      label: 'Official 7th Edition Gold Emblem Banner',
                      url: '/iaa-logo.svg',
                      description: 'Iconic Awards Africa Brand'
                    },
                    {
                      label: 'Gala Night Red Carpet Ballroom',
                      url: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
                      description: 'Red carpet photo'
                    }
                  ]}
                />
              </div>

              {/* Twitter Specific Handles & Card Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
                <div>
                  <label className="block font-bold text-neutral-700 text-xs mb-1">
                    Twitter Card Format
                  </label>
                  <select
                    value={seoForm.twitterCard}
                    onChange={e => setSeoForm({ ...seoForm, twitterCard: e.target.value as any })}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs bg-white"
                  >
                    <option value="summary_large_image">Large Image Card (Recommended)</option>
                    <option value="summary">Small Thumbnail Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 text-xs mb-1">
                    Twitter Site Handle
                  </label>
                  <input
                    type="text"
                    value={seoForm.twitterSite}
                    onChange={e => setSeoForm({ ...seoForm, twitterSite: e.target.value })}
                    placeholder="@IconicAwardsAfr"
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 text-xs mb-1">
                    Twitter Creator Handle
                  </label>
                  <input
                    type="text"
                    value={seoForm.twitterCreator}
                    onChange={e => setSeoForm({ ...seoForm, twitterCreator: e.target.value })}
                    placeholder="@IconicAwardsAfr"
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Social Share Preview Card Simulator */}
            <div className="lg:col-span-5 space-y-4">
              {/* X / Twitter Preview */}
              <div className="bg-black text-white p-5 rounded-2xl border border-neutral-800 shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>𝕏</span> Twitter Social Card Preview
                  </span>
                  <span className="font-mono text-[10px]">summary_large_image</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-neutral-800 bg-[#16181c]">
                  <div className="aspect-[1.91/1] w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
                    <img
                      src={seoForm.ogImageUrl || '/iaa-logo.svg'}
                      alt="Social share visual"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                      }}
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[11px] text-neutral-400 block font-mono">
                      {seoForm.canonicalUrl?.replace(/^https?:\/\//, '') || 'iconicawardsafrica.com'}
                    </span>
                    <h4 className="font-bold text-xs text-neutral-100 line-clamp-1">
                      {seoForm.ogTitle || seoForm.metaTitle}
                    </h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-snug">
                      {seoForm.ogDescription || seoForm.metaDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp / iMessage Chat Bubble Preview */}
              <div className="bg-[#0b141a] text-white p-5 rounded-2xl border border-neutral-800 shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>💬</span> WhatsApp & Messenger Preview
                  </span>
                </div>

                <div className="bg-[#1f2c34] p-2.5 rounded-xl border border-white/5 space-y-2 max-w-sm">
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={seoForm.ogImageUrl || '/iaa-logo.svg'}
                      alt="WhatsApp preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                      }}
                    />
                  </div>
                  <div className="space-y-0.5 px-1">
                    <span className="font-bold text-xs text-neutral-100 block line-clamp-1">
                      {seoForm.ogTitle || seoForm.metaTitle}
                    </span>
                    <p className="text-[10px] text-neutral-300 line-clamp-2">
                      {seoForm.ogDescription || seoForm.metaDescription}
                    </p>
                    <span className="text-[9px] text-neutral-400 font-mono block">
                      {seoForm.canonicalUrl || 'https://iconicawardsafrica.com'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SCHEMA.ORG STRUCTURED DATA (JSON-LD)
      ======================================================== */}
      {activeView === 'schema' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Schema Controls */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h4 className="font-serif font-bold text-sm text-neutral-900">
                  Schema.org Structured Data Generator
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoForm.enableJsonLd}
                    onChange={e => setSeoForm({ ...seoForm, enableJsonLd: e.target.checked })}
                    className="rounded text-[#E8471C] focus:ring-[#E8471C] w-4 h-4"
                  />
                  <span className="text-xs font-bold text-neutral-800">Enable JSON-LD</span>
                </label>
              </div>

              {/* Schema Entity Type */}
              <div>
                <label className="block font-bold text-neutral-700 text-xs mb-1">
                  Primary Structured Data Entity Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Event', label: 'Festival & Event Gala', desc: 'Event dates, venue, tickets' },
                    { id: 'Organization', label: 'Cultural Organization', desc: 'Brand logo, founders, contact' },
                    { id: 'WebApplication', label: 'Voting App Portal', desc: 'App category, pricing' },
                    { id: 'Custom', label: 'Custom JSON-LD Code', desc: 'Write raw custom schema' }
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSeoForm({ ...seoForm, schemaType: item.id as any })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        seoForm.schemaType === item.id
                          ? 'border-[#E8471C] bg-orange-50/40 ring-2 ring-[#E8471C]/20'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-neutral-900 block">{item.label}</span>
                      <span className="text-[10px] text-neutral-500 font-light">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Specific Schema Fields */}
              {seoForm.schemaType === 'Event' && (
                <div className="space-y-3 pt-2 border-t border-neutral-100 text-xs">
                  <span className="font-bold text-neutral-800 block text-[11px] uppercase tracking-wider text-[#E8471C]">
                    Event Gala Structured Properties
                  </span>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Official Event Title</label>
                    <input
                      type="text"
                      value={seoForm.eventName || ''}
                      onChange={e => setSeoForm({ ...seoForm, eventName: e.target.value })}
                      placeholder="Iconic Awards Africa 7th Edition..."
                      className="w-full border rounded-lg p-2 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Start Date & Time (ISO 8601)</label>
                      <input
                        type="text"
                        value={seoForm.eventStartDate || ''}
                        onChange={e => setSeoForm({ ...seoForm, eventStartDate: e.target.value })}
                        placeholder="2026-11-28T18:00:00+01:00"
                        className="w-full border rounded-lg p-2 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">End Date & Time</label>
                      <input
                        type="text"
                        value={seoForm.eventEndDate || ''}
                        onChange={e => setSeoForm({ ...seoForm, eventEndDate: e.target.value })}
                        placeholder="2026-11-29T02:00:00+01:00"
                        className="w-full border rounded-lg p-2 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Ceremony Venue Name</label>
                    <input
                      type="text"
                      value={seoForm.eventLocationName || ''}
                      onChange={e => setSeoForm({ ...seoForm, eventLocationName: e.target.value })}
                      placeholder="Grand Continental Ballroom, Landmark Centre..."
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                </div>
              )}

              {/* Custom JSON-LD Raw Editor */}
              {seoForm.schemaType === 'Custom' && (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <label className="block font-bold text-neutral-700 text-xs">
                    Custom Schema.org JSON Code
                  </label>
                  <textarea
                    rows={8}
                    value={seoForm.customJsonLd || JSON.stringify(currentSchemaJson, null, 2)}
                    onChange={e => setSeoForm({ ...seoForm, customJsonLd: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg p-3 font-mono text-[11px] bg-neutral-900 text-emerald-400 focus:outline-none"
                  />
                  {customJsonError && (
                    <div className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{customJsonError}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Formatted JSON-LD Output Viewer */}
            <div className="lg:col-span-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 shadow-md space-y-3 text-white">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#F2A01F]" />
                  <span className="font-bold text-xs text-neutral-200">
                    Live Injected <code className="font-mono text-emerald-400">&lt;script type="application/ld+json"&gt;</code>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(currentSchemaJson, null, 2), 'schema')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'schema' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'schema' ? 'Copied' : 'Copy JSON-LD'}</span>
                </button>
              </div>

              <pre className="p-3 bg-black/60 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-300 max-h-[420px] leading-relaxed border border-white/5">
                {JSON.stringify(currentSchemaJson, null, 2)}
              </pre>

              <div className="flex items-center justify-between pt-2 text-[10px] text-neutral-400">
                <span>Valid Schema.org Structure</span>
                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#F2A01F] hover:underline flex items-center gap-1"
                >
                  <span>Test in Google Rich Results</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: XML SITEMAP & ROBOTS.TXT
      ======================================================== */}
      {activeView === 'sitemap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* XML Sitemap Box */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#E8471C]" />
                  <h4 className="font-serif font-bold text-sm text-neutral-900">
                    Auto-Generated XML Sitemap (<code className="font-mono text-xs">sitemap.xml</code>)
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(currentSitemapXml, 'sitemap')}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded text-xs cursor-pointer"
                    title="Copy XML Sitemap"
                  >
                    {copiedKey === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSitemap}
                    className="px-2.5 py-1.5 bg-[#0B0B0B] text-white text-[11px] font-bold rounded flex items-center gap-1 hover:bg-neutral-800 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download XML</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-500 font-light">
                Lists all key indexed routes (Categories, Leaderboards, Nominees, Gala Tickets, Editions, Gallery) for Google, Bing, and search crawlers.
              </p>

              <pre className="p-3 bg-neutral-900 rounded-xl overflow-x-auto text-[10px] font-mono text-neutral-200 max-h-[300px] leading-relaxed">
                {currentSitemapXml}
              </pre>
            </div>

            {/* robots.txt Box */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-serif font-bold text-sm text-neutral-900">
                    Search Engine Directives (<code className="font-mono text-xs">robots.txt</code>)
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(currentRobotsTxt, 'robots')}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded text-xs cursor-pointer"
                    title="Copy robots.txt"
                  >
                    {copiedKey === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadRobots}
                    className="px-2.5 py-1.5 bg-[#0B0B0B] text-white text-[11px] font-bold rounded flex items-center gap-1 hover:bg-neutral-800 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download robots.txt</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-500 font-light">
                Guides web crawlers to public voting directories while protecting admin and private endpoints.
              </p>

              <pre className="p-3 bg-neutral-900 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-300 max-h-[300px] leading-relaxed">
                {currentRobotsTxt}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
