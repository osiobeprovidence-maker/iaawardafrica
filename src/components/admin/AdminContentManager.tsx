import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaUpload } from '../common/MediaUpload';
import {
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Share2,
  Building,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Film
} from 'lucide-react';

export const AdminContentManager: React.FC = () => {
  const { siteContent, updateSiteContent, sponsors, setSponsors, gallery, setGallery, faqs, setFaqs } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'social' | 'faqs' | 'sponsors' | 'gallery'>('general');
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for siteContent
  const [contentForm, setContentForm] = useState({ ...siteContent });

  React.useEffect(() => {
    setContentForm({ ...siteContent });
  }, [siteContent]);

  // Local state for adding sponsor
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    tier: 'gold' as const,
    logoUrl: '',
    websiteUrl: '',
    description: ''
  });

  // Local state for adding gallery image
  const [newMedia, setNewMedia] = useState<{
    title: string;
    type: 'image' | 'video';
    url: string;
    edition: string;
    tag: 'cultural-fashion' | 'red-carpet' | 'awards-night' | 'backstage';
    date: string;
  }>({
    title: '',
    type: 'image',
    url: '',
    edition: '7th Edition',
    tag: 'cultural-fashion',
    date: new Date().toISOString().split('T')[0]
  });

  // Local state for adding FAQ
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'voting' as const
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(contentForm);
    setSuccessMsg('Website content successfully saved!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsor.name) return;
    setSponsors([
      ...sponsors,
      {
        id: `sp-${Date.now()}`,
        ...newSponsor
      }
    ]);
    setNewSponsor({ name: '', tier: 'gold', logoUrl: '', websiteUrl: '', description: '' });
  };

  const handleDeleteSponsor = (id: string) => {
    setSponsors(sponsors.filter(s => s.id !== id));
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.title || !newMedia.url) return;
    setGallery([
      {
        id: `gal-${Date.now()}`,
        ...newMedia,
        date: newMedia.date || new Date().toISOString().split('T')[0]
      },
      ...gallery
    ]);
    setNewMedia({ title: '', type: 'image', url: '', edition: '7th Edition', tag: 'cultural-fashion', date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteMedia = (id: string) => {
    setGallery(gallery.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#0B0B0B]">Content & Copy Management System</h3>
          <p className="text-xs text-neutral-500">Edit public headings, about narratives, FAQs, social links, sponsors, and media galleries.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-neutral-200">
        {[
          { id: 'general', label: 'Home & Announcement' },
          { id: 'about', label: 'About Story & Mission' },
          { id: 'social', label: 'Social & Contact' },
          { id: 'faqs', label: 'FAQs List' },
          { id: 'sponsors', label: 'Sponsors & Partners' },
          { id: 'gallery', label: 'Gallery Media' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[#E8471C] text-[#E8471C]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: GENERAL */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Hero Copy & Announcement Strip</h4>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Top Announcement Bar Text</label>
            <input
              type="text"
              value={contentForm.announcementText}
              onChange={e => setContentForm({ ...contentForm, announcementText: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={contentForm.announcementActive}
              onChange={e => setContentForm({ ...contentForm, announcementActive: e.target.checked })}
            />
            <span className="font-semibold text-neutral-800">Display Top Announcement Bar</span>
          </label>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Homepage Hero Headline</label>
            <input
              type="text"
              value={contentForm.heroHeading}
              onChange={e => setContentForm({ ...contentForm, heroHeading: e.target.value })}
              className="w-full border rounded p-2 font-serif text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Homepage Hero Subheading</label>
            <textarea
              rows={3}
              value={contentForm.heroSubheading}
              onChange={e => setContentForm({ ...contentForm, heroSubheading: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E8471C] text-white font-bold uppercase rounded hover:bg-[#c93912]"
          >
            Save Homepage Copy
          </button>
        </form>
      )}

      {/* TAB: ABOUT */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">About Page Narratives</h4>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Our Founding Story</label>
            <textarea
              rows={5}
              value={contentForm.aboutStory}
              onChange={e => setContentForm({ ...contentForm, aboutStory: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Our Mission Statement</label>
            <textarea
              rows={3}
              value={contentForm.aboutMission}
              onChange={e => setContentForm({ ...contentForm, aboutMission: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Our Continental Vision</label>
            <textarea
              rows={3}
              value={contentForm.aboutVision}
              onChange={e => setContentForm({ ...contentForm, aboutVision: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E8471C] text-white font-bold uppercase rounded hover:bg-[#c93912]"
          >
            Save About Text
          </button>
        </form>
      )}

      {/* TAB: SOCIAL */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Social Media Handles & Secretariat Contacts</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Instagram URL</label>
              <input
                type="text"
                value={contentForm.socialLinks.instagram}
                onChange={e => setContentForm({
                  ...contentForm,
                  socialLinks: { ...contentForm.socialLinks, instagram: e.target.value }
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">X / Twitter URL</label>
              <input
                type="text"
                value={contentForm.socialLinks.twitter}
                onChange={e => setContentForm({
                  ...contentForm,
                  socialLinks: { ...contentForm.socialLinks, twitter: e.target.value }
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Facebook URL</label>
              <input
                type="text"
                value={contentForm.socialLinks.facebook}
                onChange={e => setContentForm({
                  ...contentForm,
                  socialLinks: { ...contentForm.socialLinks, facebook: e.target.value }
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">YouTube URL</label>
              <input
                type="text"
                value={contentForm.socialLinks.youtube}
                onChange={e => setContentForm({
                  ...contentForm,
                  socialLinks: { ...contentForm.socialLinks, youtube: e.target.value }
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">WhatsApp Direct Hotline</label>
              <input
                type="text"
                value={contentForm.socialLinks.whatsapp}
                onChange={e => setContentForm({
                  ...contentForm,
                  socialLinks: { ...contentForm.socialLinks, whatsapp: e.target.value }
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-600 mb-1">Secretariat Official Email</label>
              <input
                type="text"
                value={contentForm.contactEmail}
                onChange={e => setContentForm({ ...contentForm, contactEmail: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E8471C] text-white font-bold uppercase rounded hover:bg-[#c93912]"
          >
            Save Social & Contacts
          </button>
        </form>
      )}

      {/* TAB: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6 text-xs">
          <div>
            <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Frequently Asked Questions (FAQ)</h4>
            <p className="text-neutral-500 text-[11px]">Manage public Q&As regarding voting, ticket passes, nomination criteria, and venue access.</p>
          </div>

          {/* Add FAQ form */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
            <h5 className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider">Add New FAQ Item</h5>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Question (e.g. Can international voters vote via Flutterwave?)"
                value={newFaq.question}
                onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
                className="w-full border rounded p-2 bg-white"
              />
              <textarea
                rows={2}
                placeholder="Detailed Answer..."
                value={newFaq.answer}
                onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
                className="w-full border rounded p-2 bg-white"
              />
              <div className="flex items-center justify-between pt-1">
                <select
                  value={newFaq.category}
                  onChange={e => setNewFaq({ ...newFaq, category: e.target.value as any })}
                  className="border rounded p-1.5 bg-white text-xs"
                >
                  <option value="voting">Voting</option>
                  <option value="tickets">Tickets</option>
                  <option value="event">Event</option>
                  <option value="nominations">Nominations</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
                    setFaqs([
                      ...faqs,
                      {
                        id: `faq-${Date.now()}`,
                        question: newFaq.question.trim(),
                        answer: newFaq.answer.trim(),
                        category: newFaq.category
                      }
                    ]);
                    setNewFaq({ question: '', answer: '', category: 'voting' });
                  }}
                  className="px-4 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white font-bold uppercase rounded text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add FAQ
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="p-3 border rounded-lg bg-neutral-50 space-y-1 relative">
                <button
                  type="button"
                  onClick={() => {
                    setFaqs(faqs.filter(f => f.id !== faq.id));
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="font-bold text-neutral-900 pr-8">Q: {faq.question}</div>
                <div className="text-neutral-600 text-[11px] leading-relaxed pr-8">A: {faq.answer}</div>
                <div className="text-[10px] text-[#E8471C] font-semibold uppercase">{faq.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SPONSORS */}
      {activeTab === 'sponsors' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Partners & Sponsors Registry</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sponsors.map(sp => (
              <div key={sp.id} className="p-3 border rounded-lg bg-neutral-50 flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-neutral-900 block">{sp.name}</span>
                  <span className="text-[10px] text-[#E8471C] font-bold uppercase block">{sp.tier} Partner</span>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1">{sp.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteSponsor(sp.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Sponsor Form */}
          <form onSubmit={handleAddSponsor} className="pt-4 border-t border-neutral-200 space-y-4">
            <span className="font-bold text-neutral-800 block text-xs">Add New Sponsor / Partner</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Partner Name (e.g. Zenith Bank)"
                value={newSponsor.name}
                onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })}
                className="border rounded p-2 text-xs"
              />
              <select
                value={newSponsor.tier}
                onChange={e => setNewSponsor({ ...newSponsor, tier: e.target.value as any })}
                className="border rounded p-2 bg-white text-xs"
              >
                <option value="headline">Headline Partner</option>
                <option value="platinum">Platinum Partner</option>
                <option value="gold">Gold Partner</option>
                <option value="media">Media Partner</option>
                <option value="cultural">Cultural Partner</option>
              </select>
            </div>

            <MediaUpload
              label="Partner Logo File"
              helperText="Upload transparent PNG or SVG logo file of the partner institution."
              value={newSponsor.logoUrl}
              onChange={(url) => setNewSponsor({ ...newSponsor, logoUrl: url })}
              mediaType="image"
              aspectRatio="auto"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Official Website URL"
                value={newSponsor.websiteUrl}
                onChange={e => setNewSponsor({ ...newSponsor, websiteUrl: e.target.value })}
                className="border rounded p-2 text-xs"
              />
              <input
                type="text"
                placeholder="Partner description / endorsement..."
                value={newSponsor.description}
                onChange={e => setNewSponsor({ ...newSponsor, description: e.target.value })}
                className="border rounded p-2 text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E8471C] text-white font-bold uppercase rounded text-xs hover:bg-[#c93912]"
            >
              + Register Partner
            </button>
          </form>
        </div>
      )}

      {/* TAB: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4 text-xs">
          <h4 className="font-serif font-bold text-base text-[#0B0B0B]">Media Gallery Manager</h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.map(item => (
              <div key={item.id} className="border rounded-lg overflow-hidden relative group bg-neutral-900">
                {item.type === 'video' || item.url?.startsWith('data:video/') ? (
                  <div className="w-full h-24 bg-black flex items-center justify-center text-white">
                    <Film className="w-6 h-6 text-[#F2A01F]" />
                  </div>
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-24 object-cover" />
                )}
                <div className="p-2 bg-white">
                  <span className="font-semibold block truncate text-[11px]">{item.title}</span>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase">
                    <span>{item.tag}</span>
                    <span>{item.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Media */}
          <form onSubmit={handleAddMedia} className="pt-4 border-t border-neutral-200 space-y-4">
            <span className="font-bold text-neutral-800 block text-xs">Upload Real Media File to Gallery</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Caption Title (e.g. Red Carpet Arrival Gala 2026)"
                value={newMedia.title}
                onChange={e => setNewMedia({ ...newMedia, title: e.target.value })}
                className="border rounded p-2 text-xs"
              />
              <select
                value={newMedia.tag}
                onChange={e => setNewMedia({ ...newMedia, tag: e.target.value as any })}
                className="border rounded p-2 bg-white text-xs"
              >
                <option value="cultural-fashion">Cultural Fashion</option>
                <option value="red-carpet">Red Carpet</option>
                <option value="awards-night">Awards Night</option>
                <option value="backstage">Backstage</option>
              </select>
              <select
                value={newMedia.type}
                onChange={e => setNewMedia({ ...newMedia, type: e.target.value as any })}
                className="border rounded p-2 bg-white text-xs"
              >
                <option value="image">Photo / Image</option>
                <option value="video">Video Clip</option>
              </select>
            </div>

            <MediaUpload
              label="Media File (Photo or Video)"
              helperText="Upload real photos (JPG, PNG, WebP) or short highlight videos (MP4, WebM)."
              value={newMedia.url}
              onChange={(url, meta) => {
                setNewMedia({
                  ...newMedia,
                  url,
                  type: meta?.isVideo ? 'video' : newMedia.type
                });
              }}
              mediaType={newMedia.type === 'video' ? 'video' : 'image'}
              aspectRatio="4:3"
              required
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#E8471C] text-white font-bold uppercase rounded text-xs hover:bg-[#c93912]"
            >
              + Publish to Official Gallery
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
