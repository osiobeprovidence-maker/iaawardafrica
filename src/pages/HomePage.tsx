import React from 'react';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { VotingCountdownBanner } from '../components/common/VotingCountdownBanner';
import { NomineeCard } from '../components/common/NomineeCard';
import { Nominee } from '../types';
import {
  ArrowRight,
  Vote,
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  Award,
  Flame,
  ShieldCheck,
  Instagram,
  Twitter,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenVoteModal: (nominee?: Nominee) => void;
  onViewNomineeProfile: (nominee: Nominee) => void;
  onOpenTicketModal: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  onOpenVoteModal,
  onViewNomineeProfile,
  onOpenTicketModal,
  onSelectCategory
}) => {
  const {
    editions,
    events,
    categories,
    nominees,
    sponsors,
    siteContent,
    votingSettings,
    formatMoney
  } = useApp();

  const currentEdition = editions.find(e => e.isCurrent) || editions[0];
  const activeEvent = events[0];
  const featuredNominees = nominees.filter(n => n.featured).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[740px] bg-[#0B0B0B] text-white overflow-hidden flex items-center">
        {/* Cinematic Backdrop Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={siteContent.heroBannerImage || "/src/assets/images/iaa_hero_gala_1790253803537.jpg"}
            alt="Iconic Awards Africa Gala Night"
            className="w-full h-full object-cover opacity-35 scale-102"
            fetchPriority="high"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/src/assets/images/iaa_hero_gala_1790253803537.jpg";
            }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl space-y-6">
            {/* Edition Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8471C]/20 border border-[#E8471C]/40 text-[#FAF8F4] text-xs font-semibold">
              <span className="text-[#F2A01F] font-bold">{currentEdition.name}</span>
              <span className="text-white/60">·</span>
              <span className="font-serif italic tracking-wide">{siteContent.heroBadge || currentEdition.theme}</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              {siteContent.heroHeading}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-[#FAF8F4]/80 leading-relaxed max-w-2xl font-light">
              {siteContent.heroSubheading}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onOpenVoteModal()}
                className="px-6 py-3.5 bg-[#E8471C] hover:bg-[#c93912] active:scale-98 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Vote className="w-4 h-4" />
                {siteContent.heroPrimaryCtaText || 'Vote For Your Icons Now'}
              </button>

              <button
                type="button"
                onClick={onOpenTicketModal}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-[#C9971C]/40 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-[#F2A01F]" />
                {siteContent.heroSecondaryCtaText || 'Reserve Gala Night Tickets'}
              </button>
            </div>

            {/* Live Voting & Gala Night Countdown Group */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Voting Close Urgency Countdown */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8471C] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8471C]"></span>
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#E8471C] font-bold">
                    Official Voting Closes In
                  </span>
                </div>
                <CountdownTimer
                  targetDate={votingSettings.votingEndTime}
                  variant="terracotta"
                  passedMessage="POLLS OFFICIALLY SEALED"
                />
              </div>

              {/* Gala Event Countdown */}
              {activeEvent && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F2A01F]" />
                    <span className="text-[11px] uppercase tracking-widest text-[#F2A01F] font-bold">
                      Gala Night & Runway
                    </span>
                  </div>
                  <CountdownTimer
                    targetDate={activeEvent.date}
                    variant="gold"
                    passedMessage="GALA EVENT IS LIVE"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* African line detail on bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 kente-stripe" />
      </section>

      {/* 2. DEDICATED VOTING COUNTDOWN URGENCY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <VotingCountdownBanner
          onOpenVoteModal={onOpenVoteModal}
          onNavigateLeaderboard={() => {
            setCurrentTab('leaderboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateNominees={() => {
            setCurrentTab('nominees');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </section>

      {/* 3. UPCOMING GALA HIGHLIGHT */}
      {activeEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B0B0B] text-white rounded-2xl overflow-hidden border border-[#C9971C]/30 shadow-xl grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#F2A01F] font-bold tracking-widest uppercase">
                  <Calendar className="w-4 h-4 text-[#E8471C]" />
                  <span>Official Gala Event · 7th Edition</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {activeEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#FAF8F4]/80 leading-relaxed font-light">
                  {activeEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-[#FAF8F4]/90">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#C9971C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Saturday, November 28, 2026</span>
                    <span className="text-white/60">Red Carpet 17:00 · Gala 19:00 WAT</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C9971C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{activeEvent.venue}</span>
                    <span className="text-white/60">{activeEvent.city}, {activeEvent.country}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenTicketModal}
                  className="px-5 py-2.5 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Get Red Carpet Tickets
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('events')}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-semibold rounded-md transition-all"
                >
                  View Event Program
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-black">
              <img
                src="/src/assets/images/iaa_gold_trophy_1790253843668.jpg"
                alt="Iconic Gold Trophy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-xs text-white/90">
                  <span className="text-[#F2A01F] font-bold block text-[10px] uppercase tracking-widest">
                    The Crown of African Honors
                  </span>
                  <p className="font-serif italic text-sm">
                    Hand-carved solid bronze & 24-karat gold finish statuette
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURED NOMINEES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E8471C] mb-1">
              <Flame className="w-4 h-4 text-[#E8471C]" />
              <span>Public Voting in Progress</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B0B0B]">
              Featured Nominees Spotlight
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Cast your verified vote to propel your chosen icon to victory at the 7th Edition gala.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('nominees')}
            className="text-xs font-bold text-[#E8471C] hover:text-[#c93912] flex items-center gap-1 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>View All {nominees.length} Nominees</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredNominees.map(nominee => (
            <NomineeCard
              key={nominee.id}
              nominee={nominee}
              onVote={(n) => onOpenVoteModal(n)}
              onViewProfile={(n) => onViewNomineeProfile(n)}
            />
          ))}
        </div>
      </section>

      {/* 4. CATEGORY HIGHLIGHTS */}
      <section className="bg-[#0B0B0B] text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-widest text-[#F2A01F] font-bold block mb-2">
              Pan-African Excellence
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              7th Edition Award Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F4]/70 mt-2">
              Spanning bespoke cultural couture, pan-African creative leadership, film, music, and textile innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const catNominees = nominees.filter(n => n.categoryId === cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.id);
                    setCurrentTab('nominees');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-white/5 hover:bg-white/10 p-6 rounded-xl border border-white/10 hover:border-[#C9971C]/60 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#F2A01F]">
                      <span className="font-mono text-[11px] opacity-80">{cat.code}</span>
                      <span className="text-[11px] text-white/60">{catNominees.length} Nominees</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#F2A01F] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#FAF8F4]/70 leading-relaxed font-light">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#E8471C] font-semibold">
                    <span>Vote in this category</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setCurrentTab('categories')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-xs uppercase font-bold tracking-wider text-white transition-colors"
            >
              Explore All Categories & Criteria
            </button>
          </div>
        </div>
      </section>

      {/* 5. LIVE LEADERBOARD PREVIEW STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#F2A01F]" />
              Real-Time Continental Rankings
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B0B0B]">
              Track the Live Ballot Leaderboard
            </h3>
            <p className="text-xs text-neutral-600 max-w-xl">
              Every verified vote updates our secure ledger in real time. Watch who leads in each category as the voting deadline approaches.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('leaderboard')}
            className="px-6 py-3 bg-[#0B0B0B] hover:bg-neutral-800 text-white text-xs uppercase font-bold tracking-wider rounded-md shadow transition-all shrink-0 flex items-center gap-2"
          >
            <span>Open Live Leaderboard</span>
            <ArrowRight className="w-4 h-4 text-[#F2A01F]" />
          </button>
        </div>
      </section>

      {/* 6. SPONSORS & PARTNERS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">
            Institutional Support & Endorsements
          </span>
          <h3 className="font-serif text-lg font-bold text-[#0B0B0B]">
            Proudly Supported by Continental Giants
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className="bg-white p-4 rounded-xl border border-neutral-200/80 flex flex-col items-center justify-center text-center hover:border-[#C9971C]/50 transition-all group"
            >
              <span className="font-serif font-bold text-xs text-neutral-800 group-hover:text-[#E8471C] transition-colors">
                {sponsor.name}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">
                {sponsor.tier}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setCurrentTab('sponsors')}
            className="text-xs text-[#E8471C] hover:underline font-semibold"
          >
            Become an Official Partner for the 7th Edition →
          </button>
        </div>
      </section>

      {/* 7. SOCIAL COMMUNITY FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#FAF8F4] border border-[#C9971C]/30 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8471C]">
                #IconicAwardsAfrica · #IAACulturalFashion
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B0B0B] mt-0.5">
                Join the Continental Conversation
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={siteContent.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-[#0B0B0B] text-white text-xs font-semibold rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Instagram className="w-3.5 h-3.5 text-[#F2A01F]" />
                @iconicawardsafrica
              </a>
              <a
                href={siteContent.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-[#0B0B0B] text-white text-xs font-semibold rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Twitter className="w-3.5 h-3.5 text-[#F2A01F]" />
                @iaafricaofficial
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span className="font-semibold text-neutral-800">@bellanaijastyle</span>
                <span>2h ago</span>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                "The 7th Edition of @iconicawardsafrica is setting a new high watermark for indigenous luxury styling. Which designer takes home the gold in November?"
              </p>
              <span className="text-[#E8471C] text-[10px] font-bold block">#LagosRunway #AfricanFashion</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span className="font-semibold text-neutral-800">@arisetv</span>
                <span>5h ago</span>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                "Live voting is now officially underway across 54 African countries on the IAA portal. Certified results validated by international audit committee."
              </p>
              <span className="text-[#E8471C] text-[10px] font-bold block">#IconicAwards2026</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span className="font-semibold text-neutral-800">@folashade.atelier</span>
                <span>8h ago</span>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                "Deeply honored by our nomination for African Cultural Fashion Designer of the Year! Massive gratitude to our loom artisans across Oyo and Ogun State."
              </p>
              <span className="text-[#E8471C] text-[10px] font-bold block">#YorubaCouture #IAA7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
