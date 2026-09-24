import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Award, Users, CheckCircle2 } from 'lucide-react';

interface CategoriesPageProps {
  setCurrentTab: (tab: string) => void;
  onOpenVoteModal: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  setCurrentTab,
  onOpenVoteModal,
  onSelectCategory
}) => {
  const { categories, nominees } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8471C] uppercase tracking-widest">
          <Award className="w-3.5 h-3.5 text-[#F2A01F]" />
          <span>7th Edition Honours Structure</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B0B0B]">
          Official Award Categories & Standards
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
          Each category represents a benchmark of African creative eminence, vetted by the IAA Advisory Jury and determined by verified continental public ballot.
        </p>
      </div>

      {/* Categories Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryNominees = nominees.filter(n => n.categoryId === category.id);
          const topNominee = [...categoryNominees].sort((a, b) => b.votesCount - a.votesCount)[0];

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-neutral-200/90 p-6 flex flex-col justify-between hover:border-[#C9971C]/70 hover:shadow-lg transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#E8471C] bg-[#E8471C]/10 px-2.5 py-0.5 rounded">
                    {category.code}
                  </span>
                  <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {categoryNominees.length} Nominees
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0B0B0B] group-hover:text-[#E8471C] transition-colors leading-snug">
                    {category.name}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-2 font-light">
                    {category.description}
                  </p>
                </div>

                {topNominee && (
                  <div className="pt-3 border-t border-neutral-100 flex items-center gap-3">
                    <img
                      src={topNominee.photoUrl}
                      alt={topNominee.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#C9971C]"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        Leading Candidate
                      </span>
                      <span className="text-xs font-bold text-neutral-900 truncate block">
                        {topNominee.stageName || topNominee.name} ({topNominee.votesCount.toLocaleString()} votes)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(category.id);
                    setCurrentTab('nominees');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#0B0B0B] hover:text-[#E8471C] flex items-center gap-1.5 transition-colors"
                >
                  <span>View All {categoryNominees.length} Nominees</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
