import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Crown, Calendar, Trophy, ExternalLink } from 'lucide-react';

export const PastEditionsPage: React.FC = () => {
  const { editions } = useApp();
  const [selectedEditionId, setSelectedEditionId] = useState<string>('ed-6');

  const pastEditions = [
    {
      id: 'ed-6',
      number: 6,
      year: 2025,
      theme: 'The Renaissance of African Cinema & Sound',
      venue: 'Kigali Convention Centre, Rwanda',
      honorees: [
        { category: 'African Icon of the Year', winner: 'Genevieve Nnaji', country: 'Nigeria', notes: 'Pioneering global film distribution for Nollywood' },
        { category: 'Sound Ambassador', winner: 'Wizkid', country: 'Nigeria', notes: 'Sold-out continental arena tour showcasing African youth culture' },
        { category: 'Cultural Couture Designer', winner: 'Rich Mnisi', country: 'South Africa', notes: 'Gender-fluid luxury Tsonga textile interpretations' }
      ]
    },
    {
      id: 'ed-5',
      number: 5,
      year: 2024,
      theme: 'The Golden Decade of Young African Icons',
      venue: 'Eko Hotels Grand Ballroom, Lagos, Nigeria',
      honorees: [
        { category: 'African Icon of the Year', winner: 'Sadio Mané', country: 'Senegal', notes: 'Philanthropic community hospitals and sports diplomacy' },
        { category: 'Trailblazing Creative', winner: 'Asake', country: 'Nigeria', notes: 'Global Fuji-fusion sonic cultural takeover' },
        { category: 'Indigenous Fabric Pioneer', winner: 'Christie Brown', country: 'Ghana', notes: 'Bonwire Kente integration into global luxury retail' }
      ]
    },
    {
      id: 'ed-4',
      number: 4,
      year: 2023,
      theme: 'Echoes of Royalty & Heritage',
      venue: 'Accra International Conference Centre, Ghana',
      honorees: [
        { category: 'African Icon of the Year', winner: 'Angelique Kidjo', country: 'Benin Republic', notes: 'Four decades of uncompromising Pan-African musical matriarchy' },
        { category: 'Fashion House of the Year', winner: 'Orange Culture', country: 'Nigeria', notes: 'Sustainable artisanal dyeing and craft preservation' }
      ]
    }
  ];

  const activeArchive = pastEditions.find(e => e.id === selectedEditionId) || pastEditions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
          <Trophy className="w-3.5 h-3.5 text-[#F2A01F]" />
          <span>The Historical Laureate Roll</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
          Iconic Awards Africa Archive
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          A definitive historical ledger honoring the trailblazers, cultural architects, and legendary laureates crowned across previous editions of IAA.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {pastEditions.map(ed => (
          <button
            key={ed.id}
            onClick={() => setSelectedEditionId(ed.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedEditionId === ed.id
                ? 'bg-[#0B0B0B] text-white shadow'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            Edition {ed.number} ({ed.year})
          </button>
        ))}
      </div>

      {/* Active Edition Hero Card */}
      <div className="bg-[#0B0B0B] text-white p-6 sm:p-10 rounded-2xl border border-[#C9971C]/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#F2A01F]">
              Official Concluded Edition
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
              IAA {activeArchive.number}th Edition ({activeArchive.year})
            </h2>
            <p className="font-serif italic text-sm text-[#F2A01F] mt-1">
              "{activeArchive.theme}"
            </p>
          </div>
          <div className="text-xs text-neutral-300">
            <span className="text-neutral-400 block text-[10px] uppercase">Gala Host Venue:</span>
            <span className="font-semibold text-white">{activeArchive.venue}</span>
          </div>
        </div>

        {/* Laureates table */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[#FAF8F4]/80">
            Distinguished Category Laureates & Honorees
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeArchive.honorees.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-[#E8471C] uppercase tracking-wider block">
                  {item.category}
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-white">{item.winner}</h4>
                  <span className="text-[11px] text-neutral-400">{item.country}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {item.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
