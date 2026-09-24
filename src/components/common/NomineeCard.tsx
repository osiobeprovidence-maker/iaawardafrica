import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Nominee } from '../../types';
import { Vote, Share2, Info, Check, Copy, MessageCircle, Twitter } from 'lucide-react';

interface NomineeCardProps {
  nominee: Nominee;
  onVote: (nominee: Nominee) => void;
  onViewProfile: (nominee: Nominee) => void;
}

export const NomineeCard: React.FC<NomineeCardProps> = ({
  nominee,
  onVote,
  onViewProfile
}) => {
  const { categories, votingSettings } = useApp();
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const category = categories.find(c => c.id === nominee.categoryId);

  // Close share menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareMenuOpen(false);
      }
    };
    if (shareMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shareMenuOpen]);

  // Construct sharing URLs
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?tab=nominees&category=${nominee.categoryId}&nomineeId=${nominee.id}`;
  };

  const displayName = nominee.stageName || nominee.name;
  const categoryTitle = category?.name || 'Iconic Awards Africa';

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getShareUrl();
    const tweetText = `Vote for ${displayName} nominated for "${categoryTitle}" at the 7th Iconic Awards Africa 2026! 🏆`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&hashtags=IconicAwardsAfrica,IAA2026,AfricanExcellence`;
    window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer');
    setShareMenuOpen(false);
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getShareUrl();
    const waText = `✨ *Vote for ${displayName}*\nNominated in *"${categoryTitle}"* at the *7th Iconic Awards Africa 2026*! 🏆\n\n👉 Cast your vote now: ${shareUrl}`;
    const whatsappIntentUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(whatsappIntentUrl, '_blank', 'noopener,noreferrer');
    setShareMenuOpen(false);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShareMenuOpen(false);
      }, 1500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-neutral-200/80 hover:border-[#C9971C]/60 hover:shadow-xl transition-all duration-300 flex flex-col relative">
      {/* Photo Container with subtle gradient scrim */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-950">
        <img
          src={nominee.photoUrl}
          alt={nominee.name}
          className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Country, Featured Badge & Share Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] z-10">
          <div className="flex items-center gap-1.5">
            <span className="bg-[#0B0B0B]/80 backdrop-blur-md text-[#FAF8F4] px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider uppercase border border-white/10">
              {nominee.country}
            </span>
            {nominee.featured && (
              <span className="bg-[#E8471C] text-white px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider shadow">
                Featured Icon
              </span>
            )}
          </div>

          {/* Quick Share Trigger */}
          <div className="relative" ref={shareMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShareMenuOpen(!shareMenuOpen);
              }}
              title={`Share ${displayName}'s profile`}
              className={`p-1.5 rounded-full transition-all shadow-md backdrop-blur-md flex items-center justify-center ${
                shareMenuOpen
                  ? 'bg-[#E8471C] text-white ring-2 ring-white/50'
                  : 'bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20'
              }`}
              aria-expanded={shareMenuOpen}
              aria-label="Share options"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Share Popover Dropdown Menu */}
            {shareMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 bg-[#0B0B0B] border border-[#C9971C]/40 text-white rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1.5 border-b border-white/10 mb-1">
                  <p className="text-[10px] font-bold text-[#C9971C] uppercase tracking-wider">Share Nominee</p>
                  <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                </div>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 transition-colors font-medium text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold">Share to WhatsApp</span>
                    <span className="block text-[10px] text-white/60">Pre-filled ballot link</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 transition-colors font-medium text-left mt-0.5"
                >
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <Twitter className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold">Post to X / Twitter</span>
                    <span className="block text-[10px] text-white/60">Pre-filled tweet & tags</span>
                  </div>
                </button>

                <div className="my-1 border-t border-white/10" />

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white transition-colors font-medium text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center shrink-0">
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold text-[11px]">
                      {copied ? 'Link Copied to Clipboard!' : 'Copy Voting Link'}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom overlay text */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F2A01F] block truncate drop-shadow-sm">
            {category?.name || 'Category'}
          </span>
          <h3 className="font-serif font-bold text-lg leading-tight text-white group-hover:text-[#F2A01F] transition-colors truncate">
            {nominee.stageName || nominee.name}
          </h3>
          {nominee.stageName && (
            <span className="text-xs text-white/70 block truncate">
              {nominee.name}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-3">
          {nominee.bio}
        </p>

        {/* Live Vote Count or Rankings Indicator */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs mb-3">
          {votingSettings.showPublicVoteCounts ? (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Verified Votes
              </span>
              <span className="font-mono font-bold text-sm text-[#0B0B0B] tabular-nums">
                {nominee.votesCount.toLocaleString()}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#F2A01F] block font-semibold">
                Official Ballot
              </span>
              <span className="font-sans font-semibold text-xs text-neutral-700">
                Live Voting Active
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShareMenuOpen(!shareMenuOpen);
              }}
              className="text-neutral-500 hover:text-[#E8471C] text-xs font-semibold flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-neutral-100"
              title="Share voting link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => onViewProfile(nominee)}
              className="text-neutral-500 hover:text-[#0B0B0B] text-xs font-semibold flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-neutral-100"
            >
              <Info className="w-3.5 h-3.5" />
              Bio
            </button>
          </div>
        </div>

        {/* Primary Action */}
        <button
          type="button"
          onClick={() => onVote(nominee)}
          className="w-full py-2.5 px-3 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs uppercase font-bold tracking-wider rounded-md shadow transition-all flex items-center justify-center gap-1.5"
        >
          <Vote className="w-3.5 h-3.5" />
          Vote for {nominee.stageName ? nominee.stageName.split(' ')[0] : nominee.name.split(' ')[0]}
        </button>
      </div>
    </div>
  );
};

