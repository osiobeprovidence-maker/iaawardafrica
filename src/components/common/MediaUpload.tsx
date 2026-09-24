import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Film,
  Music,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  Link,
  Sparkles,
  AlertCircle,
  Maximize2,
  X,
  FileCheck
} from 'lucide-react';
import { processMediaFile, formatBytes, ProcessedMedia, UploadOptions } from '../../utils/mediaUpload';

export interface MediaPreset {
  label: string;
  url: string;
  description?: string;
}

export interface MediaUploadProps {
  value: string;
  onChange: (url: string, meta?: ProcessedMedia) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9' | '21:9' | 'auto';
  mediaType?: 'image' | 'video' | 'audio' | 'all';
  maxDimensions?: { width?: number; height?: number };
  presets?: MediaPreset[];
  required?: boolean;
  showUrlFallback?: boolean;
  compact?: boolean;
  className?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  value,
  onChange,
  label = 'Upload Media Asset',
  helperText,
  aspectRatio = 'auto',
  mediaType = 'image',
  maxDimensions = { width: 1600, height: 1600 },
  presets = [],
  required = false,
  showUrlFallback = true,
  compact = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [metaInfo, setMetaInfo] = useState<ProcessedMedia | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [rawUrlInput, setRawUrlInput] = useState(value || '');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine accepted MIME types
  const acceptPattern = (() => {
    switch (mediaType) {
      case 'image':
        return 'image/png, image/jpeg, image/webp, image/svg+xml, image/gif, image/avif';
      case 'video':
        return 'video/mp4, video/webm, video/quicktime, video/ogg';
      case 'audio':
        return 'audio/mpeg, audio/mp3, audio/wav, audio/ogg, audio/m4a';
      case 'all':
      default:
        return 'image/*, video/*, audio/*';
    }
  })();

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      setIsProcessing(true);
      setErrorMsg(null);

      try {
        const uploadOptions: UploadOptions = {
          maxWidth: maxDimensions.width || 1600,
          maxHeight: maxDimensions.height || 1600,
          quality: 0.85,
          format: file.type === 'image/svg+xml' ? 'preserve' : 'image/webp'
        };

        const result = await processMediaFile(file, uploadOptions);
        setMetaInfo(result);
        setRawUrlInput(result.dataUrl);
        onChange(result.dataUrl, result);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to process file. Please try a different image or video.');
      } finally {
        setIsProcessing(false);
      }
    },
    [maxDimensions, onChange]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleManualUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawUrlInput.trim()) return;
    onChange(rawUrlInput.trim());
    setMetaInfo(null);
  };

  const handleRemoveMedia = () => {
    onChange('');
    setRawUrlInput('');
    setMetaInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isVideo = value?.startsWith('data:video/') || /\.(mp4|webm|mov|ogg)($|\?)/i.test(value);
  const isAudio = value?.startsWith('data:audio/') || /\.(mp3|wav|ogg|m4a)($|\?)/i.test(value);
  const hasValue = Boolean(value && value.trim().length > 0);

  // Aspect ratio classes for preview
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
        return 'aspect-[4/3]';
      case '16:9':
        return 'aspect-[16/9]';
      case '21:9':
        return 'aspect-[21/9]';
      case 'auto':
      default:
        return 'min-h-[160px] max-h-[280px]';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        {label && (
          <label className="block font-bold text-neutral-800 text-xs flex items-center gap-1.5">
            {mediaType === 'video' ? (
              <Film className="w-3.5 h-3.5 text-[#E8471C]" />
            ) : mediaType === 'audio' ? (
              <Music className="w-3.5 h-3.5 text-[#E8471C]" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-[#E8471C]" />
            )}
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Mode switcher tabs (Upload vs Presets vs URL fallback) */}
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-[10px] font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Upload className="w-3 h-3 text-[#E8471C]" />
            <span>Upload File</span>
          </button>

          {presets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#F2A01F]" />
              <span>Presets ({presets.length})</span>
            </button>
          )}

          {showUrlFallback && (
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Link className="w-3 h-3 text-neutral-400" />
              <span>Link URL</span>
            </button>
          )}
        </div>
      </div>

      {helperText && <p className="text-[11px] text-neutral-500 font-light">{helperText}</p>}

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span className="flex-1">{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-500 hover:text-red-800 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: FILE UPLOAD & DROPZONE */}
      {activeTab === 'upload' && (
        <div>
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptPattern}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {!hasValue ? (
            /* Empty Dropzone State */
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#E8471C] bg-[#E8471C]/5 scale-[0.99] ring-4 ring-[#E8471C]/10'
                  : 'border-neutral-300 hover:border-[#E8471C] bg-neutral-50/70 hover:bg-orange-50/20'
              }`}
            >
              {isProcessing ? (
                <div className="py-4 space-y-2 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#E8471C] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-neutral-800">Optimizing & Encoding Media...</p>
                  <p className="text-[10px] text-neutral-400">Rendering crisp WebP format for fast delivery</p>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-neutral-200 flex items-center justify-center text-[#E8471C] group-hover:scale-110 transition-transform">
                    {mediaType === 'video' ? (
                      <Film className="w-6 h-6" />
                    ) : mediaType === 'audio' ? (
                      <Music className="w-6 h-6" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-900">
                      Click to Browse or Drag & Drop Media Here
                    </p>
                    <p className="text-[10px] text-neutral-500 max-w-sm">
                      Supports PNG, JPG, WebP, SVG, GIF (Photos) or MP4, WebM (Videos) up to 30MB. Real files are directly compressed and saved in-memory/storage.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-1.5 bg-[#0B0B0B] text-white hover:bg-neutral-800 text-[11px] font-bold uppercase rounded-lg shadow-sm transition-colors"
                  >
                    Select File from Device
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Active Media Preview Box */
            <div className="border border-neutral-200 bg-white rounded-xl p-3 shadow-xs space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-neutral-900 flex items-center justify-center">
                {/* Media Render Preview */}
                {isVideo ? (
                  <video
                    src={value}
                    controls
                    className={`w-full max-h-[320px] object-contain rounded-lg ${getAspectRatioClass()}`}
                  />
                ) : isAudio ? (
                  <div className="w-full p-6 flex flex-col items-center justify-center space-y-3 bg-neutral-950 text-white">
                    <Music className="w-10 h-10 text-[#F2A01F] animate-pulse" />
                    <audio src={value} controls className="w-full max-w-md" />
                  </div>
                ) : (
                  <div className={`w-full flex items-center justify-center bg-[#070707] ${getAspectRatioClass()}`}>
                    <img
                      src={value}
                      alt="Uploaded media preview"
                      className="w-full h-full object-contain max-h-[300px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                      }}
                    />
                  </div>
                )}

                {/* Top Floating Action Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm p-1 rounded-lg border border-white/15">
                  <button
                    type="button"
                    onClick={() => setIsFullscreenPreview(true)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
                    title="Replace with another file"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete uploaded media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Media Type Badge */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[#F2A01F] text-[9px] font-mono uppercase font-bold tracking-wider rounded border border-[#F2A01F]/30 flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-400" />
                    <span>Real File Loaded</span>
                  </span>
                </div>
              </div>

              {/* File Info Bar & Compression Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-800 truncate max-w-[200px]">
                    {metaInfo?.name || 'Embedded Media Asset'}
                  </span>
                  {metaInfo?.width && metaInfo?.height && (
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-mono text-neutral-600">
                      {metaInfo.width} × {metaInfo.height} px
                    </span>
                  )}
                </div>

                {metaInfo?.size ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="w-3 h-3" />
                    <span>
                      {formatBytes(metaInfo.size)}
                      {metaInfo.originalSize > metaInfo.size && (
                        <span className="text-neutral-500 font-normal ml-1">
                          (Saved {Math.round((1 - metaInfo.size / metaInfo.originalSize) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Ready for public display
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OFFICIAL PRESETS GALLERY */}
      {activeTab === 'presets' && presets.length > 0 && (
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
          <p className="text-[11px] text-neutral-600 font-medium">
            Select an official pre-approved Iconic Awards asset from our curated library:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {presets.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(preset.url);
                  setRawUrlInput(preset.url);
                  setMetaInfo(null);
                  setActiveTab('upload');
                }}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center gap-2.5 ${
                  value === preset.url
                    ? 'border-[#E8471C] bg-white shadow-sm ring-2 ring-[#E8471C]/20'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-900 shrink-0 border border-neutral-200 flex items-center justify-center">
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-neutral-800 block text-xs truncate">
                    {preset.label}
                  </span>
                  {preset.description && (
                    <span className="text-[10px] text-neutral-500 block truncate font-light">
                      {preset.description}
                    </span>
                  )}
                </div>
                {value === preset.url && (
                  <Check className="w-4 h-4 text-[#E8471C] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXTERNAL URL FALLBACK */}
      {activeTab === 'url' && showUrlFallback && (
        <form onSubmit={handleManualUrlApply} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
          <div>
            <label className="block font-semibold text-neutral-700 text-xs mb-1">
              External Web Link / CDN URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={rawUrlInput}
                onChange={(e) => setRawUrlInput(e.target.value)}
                placeholder="https://cdn.example.com/asset.jpg"
                className="w-full border border-neutral-300 rounded-lg p-2 text-xs font-mono bg-white outline-none focus:border-[#E8471C]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded-lg transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              We recommend uploading real files directly in the &apos;Upload File&apos; tab for instant compression and CDN offline persistence.
            </p>
          </div>
        </form>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {isFullscreenPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFullscreenPreview(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#0B0B0B] border border-white/20 rounded-2xl overflow-hidden p-2 flex flex-col items-center justify-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFullscreenPreview(false)}
              className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {isVideo ? (
              <video src={value} controls autoPlay className="max-w-full max-h-[80vh] rounded-lg" />
            ) : isAudio ? (
              <div className="p-8 text-white text-center space-y-4">
                <Music className="w-16 h-16 text-[#F2A01F] mx-auto" />
                <audio src={value} controls autoPlay className="w-full max-w-md" />
              </div>
            ) : (
              <img
                src={value}
                alt="Full size media preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
