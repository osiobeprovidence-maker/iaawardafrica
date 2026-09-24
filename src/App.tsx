import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TopProgressBar } from './components/common/TopProgressBar';
import { VoteModal } from './components/common/VoteModal';
import { TicketModal } from './components/common/TicketModal';
import { NomineeProfileModal } from './components/common/NomineeProfileModal';
import { Nominee, TicketTier } from './types';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NomineesPage } from './pages/NomineesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PastEditionsPage } from './pages/PastEditionsPage';
import { GalleryPage } from './pages/GalleryPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { TicketsPage } from './pages/TicketsPage';
import { ContactFAQPage } from './pages/ContactFAQPage';
import { LegalPage } from './pages/LegalPage';
import { MyVotesPage } from './pages/MyVotesPage';

// Admin
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppContent() {
  const { nominees, themeMode } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Category filter state for seamless cross-page navigation
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal States
  const [voteModalOpen, setVoteModalOpen] = useState<boolean>(false);
  const [activeNomineeForVote, setActiveNomineeForVote] = useState<Nominee | null>(null);

  const [ticketModalOpen, setTicketModalOpen] = useState<boolean>(false);
  const [activeTicketTier, setActiveTicketTier] = useState<TicketTier | null>(null);

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [activeProfileNominee, setActiveProfileNominee] = useState<Nominee | null>(null);

  // Parse deep-linked nominee URLs (e.g. from WhatsApp or Twitter shares)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      const categoryParam = searchParams.get('category');
      const nomineeIdParam = searchParams.get('nomineeId') || searchParams.get('nominee');

      if (tabParam) {
        setCurrentTab(tabParam);
      }
      if (categoryParam) {
        setSelectedCategoryFilter(categoryParam);
      }
      if (nomineeIdParam && nominees.length > 0) {
        const found = nominees.find(n => n.id === nomineeIdParam);
        if (found) {
          setActiveProfileNominee(found);
          setProfileModalOpen(true);
        }
      }
    } catch {
      // Ignore if URL parsing is unsupported
    }
  }, [nominees]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleOpenVoteModal = (nominee?: Nominee) => {
    setActiveNomineeForVote(nominee || null);
    setVoteModalOpen(true);
  };

  const handleOpenTicketModal = (tier?: TicketTier) => {
    setActiveTicketTier(tier || null);
    setTicketModalOpen(true);
  };

  const handleViewNomineeProfile = (nominee: Nominee) => {
    setActiveProfileNominee(nominee);
    setProfileModalOpen(true);
  };

  // If viewing admin dashboard
  if (currentTab === 'admin') {
    return (
      <AdminDashboard onExitAdmin={() => setCurrentTab('home')} />
    );
  }

  return (
    <div
      data-theme={themeMode}
      className={`min-h-screen flex flex-col font-sans antialiased selection:bg-[#E8471C] selection:text-white relative transition-colors duration-200 ${
        themeMode === 'dark' ? 'bg-[#070707] text-[#F3F4F6]' : 'bg-[#FAF8F4] text-[#0B0B0B]'
      }`}
    >
      {/* Viewport Top Loading Progress Bar */}
      <TopProgressBar activeTab={currentTab} />

      {/* Universal Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenVoteModal={() => handleOpenVoteModal()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            onOpenVoteModal={handleOpenVoteModal}
            onViewNomineeProfile={handleViewNomineeProfile}
            onOpenTicketModal={() => handleOpenTicketModal()}
            onSelectCategory={setSelectedCategoryFilter}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'events' && (
          <EventsPage
            setCurrentTab={setCurrentTab}
            onOpenTicketModal={() => handleOpenTicketModal()}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage
            setCurrentTab={setCurrentTab}
            onOpenVoteModal={() => handleOpenVoteModal()}
            onSelectCategory={setSelectedCategoryFilter}
          />
        )}

        {currentTab === 'nominees' && (
          <NomineesPage
            onOpenVoteModal={handleOpenVoteModal}
            onViewNomineeProfile={handleViewNomineeProfile}
            initialCategory={selectedCategoryFilter}
            onSelectCategory={setSelectedCategoryFilter}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardPage
            onOpenVoteModal={handleOpenVoteModal}
            onViewNomineeProfile={handleViewNomineeProfile}
          />
        )}

        {currentTab === 'past-editions' && (
          <PastEditionsPage />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage />
        )}

        {currentTab === 'sponsors' && (
          <SponsorsPage />
        )}

        {currentTab === 'tickets' && (
          <TicketsPage onOpenTicketModal={handleOpenTicketModal} />
        )}

        {currentTab === 'contact-faq' && (
          <ContactFAQPage />
        )}

        {currentTab === 'legal' && (
          <LegalPage />
        )}

        {currentTab === 'my-votes' && (
          <MyVotesPage
            setCurrentTab={setCurrentTab}
            onOpenVoteModal={handleOpenVoteModal}
            onViewNomineeProfile={handleViewNomineeProfile}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Modals */}
      <VoteModal
        isOpen={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        initialNominee={activeNomineeForVote}
        onNavigateToMyVotes={() => {
          setVoteModalOpen(false);
          setCurrentTab('my-votes');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        selectedTier={activeTicketTier}
      />

      <NomineeProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        nominee={activeProfileNominee}
        onVote={(nom) => {
          setProfileModalOpen(false);
          handleOpenVoteModal(nom);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
