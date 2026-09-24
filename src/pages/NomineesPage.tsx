import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NomineeCard } from '../components/common/NomineeCard';
import { triggerTopProgress } from '../components/common/TopProgressBar';
import { Nominee } from '../types';
import { Search, Filter, Vote, Award, CheckCircle2 } from 'lucide-react';

interface NomineesPageProps {
  onOpenVoteModal: (nominee?: Nominee) => void;
  onViewNomineeProfile: (nominee: Nominee) => void;
  initialCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const NomineesPage: React.FC<NomineesPageProps> = ({
  onOpenVoteModal,
  onViewNomineeProfile,
  initialCategory = 'all',
  onSelectCategory
}) => {
  const { nominees, categories, editions } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedEdition, setSelectedEdition] = useState<string>('ed-7');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleCategorySelect = (catId: string) => {
    triggerTopProgress(180);
    setSelectedCategory(catId);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const filteredNominees = nominees.filter(n => {
    // Edition match
    if (selectedEdition && n.editionId !== selectedEdition) return false;
    // Category match
    if (selectedCategory !== 'all' && n.categoryId !== selectedCategory) return false;
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = n.name.toLowerCase().includes(q);
      const matchStage = n.stageName?.toLowerCase().includes(q);
      const matchBio = n.bio.toLowerCase().includes(q);
      const matchCountry = n.country.toLowerCase().includes(q);
      if (!matchName && !matchStage && !matchBio && !matchCountry) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-[#F2A01F]" />
            <span>7th Edition Official Nominees</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
            Official Candidates & Cultural Icons
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl font-light">
            Browse through the verified continental nominees. Every paid vote cast through Paystack or Flutterwave contributes to their official live ranking.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, country..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#E8471C]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Edition selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
            Edition:
          </span>
          {editions.map(ed => (
            <button
              key={ed.id}
              onClick={() => setSelectedEdition(ed.id)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
                selectedEdition === ed.id
                  ? 'bg-[#0B0B0B] text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {ed.name} {ed.isCurrent && '★'}
            </button>
          ))}
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
            Category:
          </span>
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#E8471C] text-white shadow-sm font-bold'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            All Categories ({nominees.length})
          </button>
          {categories.map(cat => {
            const count = nominees.filter(n => n.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#E8471C] text-white shadow-sm font-bold'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 font-medium'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Nominees Grid */}
      {filteredNominees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNominees.map(nominee => (
            <NomineeCard
              key={nominee.id}
              nominee={nominee}
              onVote={(n) => onOpenVoteModal(n)}
              onViewProfile={(n) => onViewNomineeProfile(n)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200 p-8 space-y-3">
          <p className="font-serif font-bold text-lg text-neutral-800">No Nominees Found</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No nominees matched your search criteria. Try clearing your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-[#0B0B0B] text-white text-xs font-semibold rounded-md hover:bg-neutral-800"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
