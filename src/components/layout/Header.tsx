import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, Shield, Globe, Award, Vote, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenVoteModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenVoteModal }) => {
  const { siteContent, editions, currentUser, voterProfile, transactions, themeMode, toggleThemeMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentEdition = editions.find(e => e.isCurrent) || editions[0];

  const myVerifiedVotes = transactions
    .filter(t => t.voterEmail.toLowerCase().trim() === (voterProfile.email || '').toLowerCase().trim() && t.status === 'verified')
    .reduce((acc, t) => acc + t.votesCount, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'nominees', label: 'Nominees' },
    { id: 'categories', label: 'Categories' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'events', label: 'Events' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'past-editions', label: 'Archive' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#C9971C]/20 transition-all">
      {/* Top Announcements Strip if active */}
      {siteContent.announcementActive && (
        <div className="bg-[#E8471C] text-[#FAF8F4] text-[11px] font-semibold tracking-wider py-1.5 px-4 text-center overflow-hidden flex items-center justify-center gap-2">
          <span className="truncate">{siteContent.announcementText}</span>
          <span className="hidden sm:inline-block opacity-75">· 7th Edition Live</span>
        </div>
      )}

      {/* Main Top Bar: Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark with Official Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            {siteContent.logoUrl ? (
              <img
                src={siteContent.logoUrl}
                alt={siteContent.brandName || "Iconic Awards Africa"}
                style={{ height: `${siteContent.logoHeight || 48}px` }}
                className="w-auto max-h-14 object-contain transition-transform group-hover:scale-102"
                onError={(e) => {
                  // Graceful fallback to default SVG
                  (e.target as HTMLImageElement).src = '/iaa-logo.svg';
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E8471C] to-[#C9971C] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
                  IAA
                </div>
                <div>
                  <span className="font-serif font-bold text-white text-base tracking-tight block">
                    {siteContent.brandName || 'Iconic Awards Africa'}
                  </span>
                  <span className="text-[10px] text-[#C9971C] uppercase tracking-widest block font-medium">
                    {currentEdition.name}
                  </span>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Zone 2: Clean text navigation links (4-6 links, text with subtle hover effect) */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-6 text-xs xl:text-sm font-medium">
          {navLinks.map(link => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors py-1 relative whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'text-[#FAF8F4] font-semibold'
                    : 'text-[#FAF8F4]/70 hover:text-[#FAF8F4]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8471C] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions - Theme Switcher + Vote Button + Admin link */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Theme Mode Toggle (Light Mode vs High-Contrast Dark Mode) */}
          <button
            onClick={toggleThemeMode}
            className={`p-2 rounded-md transition-all text-xs flex items-center justify-center border cursor-pointer ${
              themeMode === 'dark'
                ? 'bg-[#1F1F24] border-[#F2A01F]/50 text-[#F2A01F] shadow-sm hover:bg-[#2A2A30]'
                : 'bg-[#181818] border-[#C9971C]/30 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to High-Contrast Dark Mode'}
            aria-label="Toggle display theme mode"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F2A01F]" />
            ) : (
              <Moon className="w-4 h-4 text-[#FAF8F4]" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              if (onOpenVoteModal) {
                onOpenVoteModal();
              } else {
                handleNavClick('nominees');
              }
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E8471C] hover:bg-[#c93912] active:scale-98 transition-all rounded-md shadow-md whitespace-nowrap"
          >
            Vote Now
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-2 rounded-md transition-colors text-xs flex items-center gap-1.5 focus:outline-none ${
              currentTab.startsWith('admin')
                ? 'bg-[#C9971C] text-black font-semibold'
                : 'text-[#FAF8F4]/70 hover:text-[#FAF8F4] hover:bg-white/5 border border-white/10'
            }`}
            title="Admin Dashboard"
          >
            <Shield className="w-4 h-4 text-[#F2A01F]" />
            <span className="hidden md:inline">Admin</span>
            {currentUser && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Authenticated" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#FAF8F4]/80 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0B0B] border-b border-[#C9971C]/30 px-6 py-5 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E8471C]/15 text-[#E8471C] font-bold border-l-2 border-[#E8471C]'
                      : 'text-[#FAF8F4]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('my-votes')}
                className="w-full py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider text-white bg-[#181818] border border-[#C9971C]/30 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Vote className="w-4 h-4 text-[#F2A01F]" />
                My Votes & Ballot History
                {myVerifiedVotes > 0 && (
                  <span className="bg-[#E8471C] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {myVerifiedVotes}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenVoteModal) onOpenVoteModal();
                  else handleNavClick('nominees');
                }}
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#E8471C] rounded-md shadow"
              >
                Vote Now
              </button>

              <button
                onClick={() => {
                  toggleThemeMode();
                }}
                className="w-full py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider text-white bg-[#181818] border border-[#C9971C]/30 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                {themeMode === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-[#F2A01F]" />
                    <span>Switch to Light Sand Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#FAF8F4]" />
                    <span>Switch to High-Contrast Dark Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2 text-center text-xs font-medium text-[#FAF8F4]/80 hover:text-white border border-white/20 rounded-md flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#F2A01F]" />
                Admin Dashboard Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kente bottom accent line */}
      <div className="h-[2.5px] w-full kente-stripe opacity-90" />
    </header>
  );
};
