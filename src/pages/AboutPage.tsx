import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Crown,
  Globe,
  Users,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentTab }) => {
  const { siteContent, editions } = useApp();

  const leadershipTeam = [
    {
      name: 'Otunba Adebayo Alabi',
      role: 'Executive Chairman & Founder',
      bio: 'Pioneering African cultural diplomat with 25+ years spearheading creative economy initiatives across West and Southern Africa.',
      image: '/src/assets/images/nominee_fashion_designer_1790253812536.jpg'
    },
    {
      name: 'Dr. Folake Coker-Mensah',
      role: 'Head of Academy & Jury President',
      bio: 'Fashion historian, author, and curator celebrated for institutionalizing African textile preservation in global academic museums.',
      image: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg'
    },
    {
      name: 'Chuka Ekwueme',
      role: 'Director of Technology & Ballot Audits',
      bio: 'Fintech systems architect ensuring cryptographic integrity, server-authoritative tallies, and fraud-resistant voting pipelines.',
      image: '/src/assets/images/nominee_music_artist_1790253823714.jpg'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] uppercase tracking-widest text-[#E8471C] font-bold block">
          {siteContent.aboutSubtitle || 'Institutional Heritage'}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B0B0B] leading-tight">
          {siteContent.aboutHeadline || 'Crowning African Cultural Excellence Since 2020'}
        </h1>
        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-light">
          {siteContent.tagline ? `${siteContent.brandName || 'Iconic Awards Africa'} - ${siteContent.tagline}` : 'Iconic Awards Africa (IAA) is the preeminent honors institution established to elevate indigenous African artistry, haute couture fashion, and transformational leadership onto the global center stage.'}
        </p>
      </div>

      {/* 2. Story & Mission Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#0B0B0B] text-white p-8 sm:p-10 rounded-2xl border border-[#C9971C]/30 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2A01F] uppercase tracking-widest">
            <Compass className="w-4 h-4 text-[#E8471C]" />
            <span>Our Founding Story</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
            Rewriting the Global Narrative of African Luxury & Dignity
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF8F4]/80 leading-relaxed font-light">
            {siteContent.aboutStory}
          </p>
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#F2A01F] font-bold block mb-1">Our Mission</span>
              <p className="text-white/70 leading-relaxed">{siteContent.aboutMission}</p>
            </div>
            <div>
              <span className="text-[#F2A01F] font-bold block mb-1">Our Continental Vision</span>
              <p className="text-white/70 leading-relaxed">{siteContent.aboutVision}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[340px] bg-neutral-900 border border-neutral-200 shadow-md">
          <img
            src={siteContent.aboutBannerImage || "/src/assets/images/iaa_hero_gala_1790253803537.jpg"}
            alt="IAA Red Carpet Ceremony"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/src/assets/images/iaa_hero_gala_1790253803537.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
            <span className="text-xs font-serif italic text-[#F2A01F]">The 7th Edition</span>
            <h3 className="font-serif font-bold text-xl text-white">The African Cultural Fashion Edition</h3>
            <p className="text-xs text-neutral-300 mt-1">
              November 28, 2026 · Grand Ballroom, Eko Hotels & Suites, Victoria Island, Lagos
            </p>
          </div>
        </div>
      </div>

      {/* 3. What IAA Does */}
      <section className="space-y-8">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#E8471C] font-bold block mb-1">
            Pillars of Impact
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B0B0B]">
            What Iconic Awards Africa Does
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#E8471C]/10 text-[#E8471C] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0B0B0B]">
              Transparent Public Honors
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We empower millions of cultural enthusiasts across Africa and the diaspora to vote directly for their icons through certified cryptographic payment verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F2A01F]/15 text-[#C9971C] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0B0B0B]">
              Cultural Fashion Runway
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Our annual gala hosts the continent's most prestigious cultural fashion runway, pairing master indigenous loom weavers with contemporary haute couture houses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0B0B]/10 text-[#0B0B0B] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0B0B0B]">
              Artisan Heritage Fund
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              10% of all public voting proceeds are channeled directly into apprentice grants for youth preserving traditional African textile weaving and craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Leadership & Jury */}
      <section className="space-y-8">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#E8471C] font-bold block mb-1">
            Governance & Jury
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B0B0B]">
            Executive Leadership & Advisory Board
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {leadershipTeam.map(member => (
            <div key={member.name} className="bg-white rounded-xl overflow-hidden border border-neutral-200 flex flex-col">
              <div className="aspect-[4/3] bg-neutral-900 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8471C] block">
                    {member.role}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#0B0B0B] mt-0.5">
                    {member.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Past Editions Timeline */}
      <section className="space-y-8 pt-6 border-t border-neutral-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#E8471C] font-bold block mb-1">
              Historical Retrospective
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B0B0B]">
              The IAA Editions Timeline
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('past-editions')}
            className="text-xs font-bold text-[#E8471C] hover:underline flex items-center gap-1"
          >
            Explore Past Winners Gallery →
          </button>
        </div>

        <div className="space-y-4">
          {editions.map(ed => (
            <div
              key={ed.id}
              className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C9971C]/50 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-lg text-[#0B0B0B]">
                    {ed.name} ({ed.year})
                  </span>
                  {ed.isCurrent ? (
                    <span className="px-2 py-0.5 bg-[#E8471C] text-white text-[10px] font-bold uppercase rounded">
                      Current Edition
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-semibold uppercase rounded">
                      Concluded
                    </span>
                  )}
                </div>
                <h4 className="font-serif italic text-sm text-[#C9971C] font-medium">
                  "{ed.theme}"
                </h4>
                <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
                  {ed.description}
                </p>
              </div>

              {ed.isCurrent ? (
                <button
                  type="button"
                  onClick={() => setCurrentTab('nominees')}
                  className="px-4 py-2 bg-[#E8471C] hover:bg-[#c93912] text-white text-xs font-bold uppercase rounded transition-colors whitespace-nowrap self-start sm:self-center"
                >
                  Vote Now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentTab('past-editions')}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded transition-colors whitespace-nowrap self-start sm:self-center"
                >
                  View Archive
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
