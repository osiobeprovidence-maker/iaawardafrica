import React from 'react';
import { useApp } from '../../context/AppContext';
import { Nominee } from '../../types';
import {
  X,
  Vote,
  Share2,
  Instagram,
  Twitter,
  Globe,
  Award,
  MapPin,
  MessageCircle,
  Check,
  Copy
} from 'lucide-react';

interface NomineeProfileModalProps {
  nominee: Nominee | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (nominee: Nominee) => void;
}

export const NomineeProfileModal: React.FC<NomineeProfileModalProps> = ({
  nominee,
  isOpen,
  onClose,
  onVote
}) => {
  const { categories, votingSettings } = useApp();

  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !nominee) return null;

  const category = categories.find(c => c.id === nominee.categoryId);
  const displayName = nominee.stageName || nominee.name;
  const categoryTitle = category?.name || 'Iconic Awards Africa';
  const shareUrl = `${window.location.origin}/?tab=nominees&category=${nominee.categoryId}&nomineeId=${nominee.id}`;

  const handleShare = (platform: 'whatsapp' | 'twitter') => {
    if (platform === 'whatsapp') {
      const waText = `✨ *Vote for ${displayName}*\nNominated in *"${categoryTitle}"* at the *7th Iconic Awards Africa 2026*! 🏆\n\n👉 Cast your vote now: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank', 'noopener,noreferrer');
    } else {
      const tweetText = `Vote for ${displayName} nominated for "${categoryTitle}" at the 7th Iconic Awards Africa 2026! 🏆`;
      const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&hashtags=IconicAwardsAfrica,IAA2026,AfricanExcellence`;
      window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyLink = async () => {
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
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F4] text-[#0B0B0B] rounded-xl shadow-2xl border border-[#C9971C]/40 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-black">
            <img
              src={nominee.photoUrl}
              alt={nominee.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          </div>

          {/* Right Column: Bio & Voting */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8471C] block">
                  {category?.name}
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#0B0B0B] mt-1">
                  {nominee.stageName || nominee.name}
                </h3>
                {nominee.stageName && (
                  <p className="text-xs text-neutral-500 font-medium">Legal: {nominee.name}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
                  <MapPin className="w-3.5 h-3.5 text-[#C9971C]" />
                  <span>{nominee.country}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">Official 7th Edition Nominee</span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Cultural Impact & Biography
                </h4>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {nominee.bio}
                </p>
              </div>

              {/* Vote Stats */}
              <div className="bg-neutral-100 p-3.5 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600 font-medium">
                    {votingSettings.showPublicVoteCounts ? 'Current Verified Votes:' : 'Ballot Status:'}
                  </span>
                  <span className="font-mono font-bold text-sm text-[#0B0B0B] tabular-nums">
                    {votingSettings.showPublicVoteCounts ? nominee.votesCount.toLocaleString() : 'Public Voting Open'}
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                  Social Channels
                </span>
                <div className="flex items-center gap-3 text-xs text-neutral-700">
                  {nominee.socials.instagram && (
                    <a
                      href={`https://instagram.com/${nominee.socials.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-[#E8471C] transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5 text-[#C9971C]" />
                      <span>{nominee.socials.instagram}</span>
                    </a>
                  )}
                  {nominee.socials.twitter && (
                    <a
                      href={`https://x.com/${nominee.socials.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-[#E8471C] transition-colors"
                    >
                      <Twitter className="w-3.5 h-3.5 text-[#C9971C]" />
                      <span>{nominee.socials.twitter}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-neutral-200 space-y-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onVote(nominee);
                }}
                className="w-full py-3 px-4 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs uppercase font-bold tracking-wider rounded-md shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Vote className="w-4 h-4" />
                Vote for this Nominee
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleShare('whatsapp')}
                  className="py-2 px-1 text-xs border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 rounded text-emerald-800 font-medium flex items-center justify-center gap-1.5 transition-colors"
                  title="Share to WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShare('twitter')}
                  className="py-2 px-1 text-xs border border-sky-300 bg-sky-50/50 hover:bg-sky-100 rounded text-sky-800 font-medium flex items-center justify-center gap-1.5 transition-colors"
                  title="Share on X / Twitter"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-600" />
                  <span>X / Twitter</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2 px-1 text-xs border border-neutral-300 bg-white hover:bg-neutral-100 rounded text-neutral-700 font-medium flex items-center justify-center gap-1.5 transition-colors"
                  title="Copy direct voting link"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
