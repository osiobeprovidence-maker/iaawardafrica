import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryMedia } from '../types';
import { MediaUpload } from '../components/common/MediaUpload';
import { Image, Play, X, ChevronRight, Calendar, Plus, Film, CheckCircle2, UploadCloud } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery, setGallery } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [activeMedia, setActiveMedia] = useState<GalleryMedia | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState<'red-carpet' | 'awards-night' | 'cultural-fashion' | 'backstage'>('cultural-fashion');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');

  const filteredMedia = gallery.filter(item => {
    if (filter === 'all') return true;
    return item.tag === filter;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newMediaItem: GalleryMedia = {
      id: `gal-pub-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      url: newUrl.trim(),
      edition: '7th Edition (2026)',
      tag: newTag,
      date: new Date().toISOString().split('T')[0]
    };

    setGallery([newMediaItem, ...gallery]);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewUrl('');
    setSuccessToast('Media asset uploaded successfully to the Continental Gallery!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Submit Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
            <Image className="w-3.5 h-3.5 text-[#F2A01F]" />
            <span>Visual Retrospective & Live Media Hub</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
            Official Media & Moments
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
            Capturing unforgettable moments of African majesty, runway brilliance, and ceremonial triumph. Upload and explore real photos and video highlights.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Media File</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'all', label: 'All Highlights' },
          { id: 'red-carpet', label: 'Red Carpet Glamour' },
          { id: 'cultural-fashion', label: 'Cultural Couture' },
          { id: 'awards-night', label: 'Ceremony Honors' },
          { id: 'backstage', label: 'Backstage & VIP' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-[#0B0B0B] text-white shadow-sm'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map(item => {
          const isVideo = item.type === 'video' || item.url?.startsWith('data:video/') || /\.(mp4|webm|mov)($|\?)/i.test(item.url);

          return (
            <div
              key={item.id}
              onClick={() => setActiveMedia(item)}
              className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 hover:border-[#C9971C] cursor-pointer shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black flex items-center justify-center">
                {isVideo ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
                    <Film className="w-12 h-12 text-[#F2A01F]/80 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase rounded flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Video
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Tag Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 bg-[#0B0B0B]/80 backdrop-blur-sm text-white text-[9px] uppercase font-bold tracking-wider rounded border border-white/10">
                    {item.tag.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">{item.edition}</span>
                  <h3 className="font-serif font-bold text-sm text-[#0B0B0B] group-hover:text-[#E8471C] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[11px] text-[#C9971C] font-semibold mt-2 inline-flex items-center gap-1">
                  {isVideo ? 'Play video clip →' : 'View high-res photo →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#0B0B0B] text-white rounded-2xl overflow-hidden border border-[#C9971C]/50 shadow-2xl"
          >
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black rounded-full text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center p-2">
              {activeMedia.type === 'video' || activeMedia.url?.startsWith('data:video/') ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-auto max-w-full object-contain mx-auto rounded-lg"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain mx-auto rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                  }}
                />
              )}
            </div>

            <div className="p-5 flex items-center justify-between border-t border-white/10 bg-[#070707]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#F2A01F] block">
                  {activeMedia.edition} · {activeMedia.tag.replace('-', ' ')}
                </span>
                <h4 className="font-serif font-bold text-lg text-white mt-0.5">
                  {activeMedia.title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8471C]/10 text-[#E8471C] flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-neutral-900">Upload Media File to Gallery</h3>
                  <p className="text-[11px] text-neutral-500">Add a real photo or video to the public retrospective.</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Media Caption / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Reception & Red Carpet Walk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#E8471C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Category Tag</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as any)}
                    className="w-full border border-neutral-300 rounded-lg p-2.5 bg-white text-xs"
                  >
                    <option value="cultural-fashion">Cultural Couture</option>
                    <option value="red-carpet">Red Carpet Glamour</option>
                    <option value="awards-night">Ceremony Honors</option>
                    <option value="backstage">Backstage & VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Media Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full border border-neutral-300 rounded-lg p-2.5 bg-white text-xs"
                  >
                    <option value="image">Photo / Still Image</option>
                    <option value="video">Video Highlight Clip</option>
                  </select>
                </div>
              </div>

              <MediaUpload
                label="Direct Media File Upload"
                helperText="Select or drag & drop a real photo (JPG, PNG, WebP) or video clip (MP4, WebM) from your device."
                value={newUrl}
                onChange={(url, meta) => {
                  setNewUrl(url);
                  if (meta?.isVideo) setNewType('video');
                }}
                mediaType={newType === 'video' ? 'video' : 'image'}
                aspectRatio="4:3"
                required
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newUrl.trim() || !newTitle.trim()}
                  className="px-5 py-2 bg-[#E8471C] hover:bg-[#c93912] disabled:opacity-50 text-white font-bold uppercase rounded-lg shadow transition-colors"
                >
                  Publish Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

