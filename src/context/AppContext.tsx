import React, { createContext, useContext, useState, useEffect } from 'react';
import { triggerTopProgress } from '../components/common/TopProgressBar';
import { applySeoToDOM, DEFAULT_SEO_SETTINGS } from '../utils/seoManager';
import {
  Currency,
  UserRole,
  AdminUser,
  Edition,
  Event,
  Category,
  Nominee,
  VoteBundle,
  PromoCode,
  VoteTransaction,
  TicketTier,
  TicketOrder,
  Sponsor,
  FAQItem,
  GalleryMedia,
  VotingSettings,
  SiteContent,
  VoterProfile
} from '../types';
import {
  INITIAL_EDITIONS,
  INITIAL_EVENTS,
  INITIAL_CATEGORIES,
  INITIAL_NOMINEES,
  INITIAL_VOTE_BUNDLES,
  INITIAL_PROMO_CODES,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKET_TIERS,
  INITIAL_SPONSORS,
  INITIAL_FAQS,
  INITIAL_GALLERY,
  INITIAL_VOTING_SETTINGS,
  INITIAL_SITE_CONTENT,
  INITIAL_ADMIN_USERS
} from '../data/initialData';

interface AppContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatMoney: (amountNGN: number, preferredCurrency?: Currency) => string;
  convertNGNToUSD: (amountNGN: number) => number;
  
  // Data
  editions: Edition[];
  setEditions: React.Dispatch<React.SetStateAction<Edition[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  nominees: Nominee[];
  setNominees: React.Dispatch<React.SetStateAction<Nominee[]>>;
  voteBundles: VoteBundle[];
  setVoteBundles: React.Dispatch<React.SetStateAction<VoteBundle[]>>;
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  transactions: VoteTransaction[];
  ticketTiers: TicketTier[];
  setTicketTiers: React.Dispatch<React.SetStateAction<TicketTier[]>>;
  ticketOrders: TicketOrder[];
  sponsors: Sponsor[];
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[]>>;
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  gallery: GalleryMedia[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryMedia[]>>;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  votingSettings: VotingSettings;
  siteContent: SiteContent;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  toggleThemeMode: () => void;
  voterProfile: VoterProfile;
  updateVoterProfile: (profile: Partial<VoterProfile>) => void;
  
  // Admin Auth
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  loginAdmin: (email: string, role?: UserRole) => boolean;
  logoutAdmin: () => void;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  // Actions
  submitVote: (data: {
    nomineeId: string;
    votesCount: number;
    voterName: string;
    voterEmail: string;
    voterPhone: string;
    currency: Currency;
    gateway: 'paystack' | 'flutterwave';
    promoCode?: string;
  }) => Promise<{ success: boolean; transaction: VoteTransaction; error?: string }>;
  
  purchaseTickets: (data: {
    eventId: string;
    tierId: string;
    quantity: number;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    gateway: 'paystack' | 'flutterwave';
    currency: Currency;
  }) => Promise<{ success: boolean; order: TicketOrder; error?: string }>;
  
  // Admin CRUD
  addEdition: (item: Omit<Edition, 'id'>) => void;
  updateEdition: (id: string, item: Partial<Edition>) => void;
  deleteEdition: (id: string) => void;
  
  addEvent: (item: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, item: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  addCategory: (item: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, item: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addNominee: (item: Omit<Nominee, 'id' | 'votesCount'>) => void;
  updateNominee: (id: string, item: Partial<Nominee>) => void;
  deleteNominee: (id: string) => void;
  setNomineeStatus: (id: string, status: Nominee['status']) => void;
  adjustNomineeVotes: (id: string, newVotes: number) => void;
  
  updateVotingSettings: (settings: Partial<VotingSettings>) => void;
  updateSiteContent: (content: Partial<SiteContent>) => void;
  
  addVoteBundle: (bundle: Omit<VoteBundle, 'id'>) => void;
  updateVoteBundle: (id: string, bundle: Partial<VoteBundle>) => void;
  deleteVoteBundle: (id: string) => void;

  addPromoCode: (promo: Omit<PromoCode, 'id' | 'usageCount'>) => void;
  updatePromoCode: (id: string, promo: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  
  refundTransaction: (id: string) => void;
  
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => void;
  deleteSponsor: (id: string) => void;
  
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  deleteFAQ: (id: string) => void;
  
  addGalleryItem: (item: Omit<GalleryMedia, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  
  addTicketTier: (tier: Omit<TicketTier, 'id' | 'soldQuantity'>) => void;
  updateTicketTier: (id: string, tier: Partial<TicketTier>) => void;
  deleteTicketTier: (id: string) => void;

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'iaa_data_v1_store';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('NGN');
  
  // Try loading from localStorage
  const [editions, setEditions] = useState<Edition[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_editions`);
    return saved ? JSON.parse(saved) : INITIAL_EDITIONS;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [nominees, setNominees] = useState<Nominee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_nominees`);
    return saved ? JSON.parse(saved) : INITIAL_NOMINEES;
  });

  const [voteBundles, setVoteBundles] = useState<VoteBundle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bundles`);
    return saved ? JSON.parse(saved) : INITIAL_VOTE_BUNDLES;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_promos`);
    return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
  });

  const [transactions, setTransactions] = useState<VoteTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasSeed = Array.isArray(parsed) && parsed.some((t: VoteTransaction) => t.id === 'tx-2001');
        if (!hasSeed && Array.isArray(parsed)) {
          return [...INITIAL_TRANSACTIONS.filter(it => it.id.startsWith('tx-200')), ...parsed];
        }
        return parsed;
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ticket_tiers`);
    return saved ? JSON.parse(saved) : INITIAL_TICKET_TIERS;
  });

  const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ticket_orders`);
    return saved ? JSON.parse(saved) : [];
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sponsors`);
    return saved ? JSON.parse(saved) : INITIAL_SPONSORS;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_faqs`);
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [gallery, setGallery] = useState<GalleryMedia[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [votingSettings, setVotingSettingsState] = useState<VotingSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_voting_settings`);
    return saved ? JSON.parse(saved) : INITIAL_VOTING_SETTINGS;
  });

  const [siteContent, setSiteContentState] = useState<SiteContent>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_site_content`);
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SITE_CONTENT,
          ...parsed,
          seo: {
            ...DEFAULT_SEO_SETTINGS,
            ...(parsed.seo || {})
          }
        };
      }
      return INITIAL_SITE_CONTENT;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  });

  // Global Theme Mode (light vs high-contrast dark)
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem(`${STORAGE_KEY}_theme_mode`);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    const savedSiteContent = localStorage.getItem(`${STORAGE_KEY}_site_content`);
    if (savedSiteContent) {
      try {
        const parsed = JSON.parse(savedSiteContent);
        if (parsed.themeMode === 'light' || parsed.themeMode === 'dark') {
          return parsed.themeMode;
        }
      } catch {
        // fallback
      }
    }
    return 'light';
  });

  const setThemeMode = (mode: 'light' | 'dark') => {
    setThemeModeState(mode);
    localStorage.setItem(`${STORAGE_KEY}_theme_mode`, mode);
    setSiteContentState(prev => {
      const next = { ...prev, themeMode: mode };
      localStorage.setItem(`${STORAGE_KEY}_site_content`, JSON.stringify(next));
      return next;
    });
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  // Synchronize theme to document root & body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark');
      body.setAttribute('data-theme', 'dark');
      body.style.backgroundColor = '#070707';
      body.style.color = '#F3F4F6';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark');
      body.setAttribute('data-theme', 'light');
      body.style.backgroundColor = '#FAF8F4';
      body.style.color = '#0B0B0B';
    }
  }, [themeMode]);

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_admin_users`);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  // Admin session state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    return saved ? JSON.parse(saved) : null;
  });

  // Public Voter Profile state (remembers active voter details & voting records)
  const [voterProfile, setVoterProfileState] = useState<VoterProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_voter_profile`);
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Rezzy Rider',
          email: 'riderezzy@gmail.com',
          phone: '+2348023456789'
        };
  });

  const updateVoterProfile = (updates: Partial<VoterProfile>) => {
    setVoterProfileState(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(`${STORAGE_KEY}_voter_profile`, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_admin_users`, JSON.stringify(adminUsers));
  }, [adminUsers]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_editions`, JSON.stringify(editions));
  }, [editions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_nominees`, JSON.stringify(nominees));
  }, [nominees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bundles`, JSON.stringify(voteBundles));
  }, [voteBundles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_promos`, JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ticket_tiers`, JSON.stringify(ticketTiers));
  }, [ticketTiers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ticket_orders`, JSON.stringify(ticketOrders));
  }, [ticketOrders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sponsors`, JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_faqs`, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_voting_settings`, JSON.stringify(votingSettings));
  }, [votingSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_site_content`, JSON.stringify(siteContent));
    // Synchronize full real SEO meta tags and Schema.org JSON-LD to document head
    if (siteContent.seo) {
      applySeoToDOM(
        siteContent.seo,
        siteContent,
        editions.find(e => e.isCurrent),
        events
      );
    }
  }, [siteContent, editions, events]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);

  // Conversion & Money formatting
  const convertNGNToUSD = (amountNGN: number): number => {
    const rate = votingSettings.usdToNgnRate || 1550;
    return Number((amountNGN / rate).toFixed(2));
  };

  const formatMoney = (amountNGN: number, preferredCurrency?: Currency): string => {
    const activeCurrency = preferredCurrency || currency;
    if (activeCurrency === 'USD') {
      const usdVal = convertNGNToUSD(amountNGN);
      return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₦${amountNGN.toLocaleString('en-NG')}`;
  };

  // Auth functions
  const loginAdmin = (email: string, role: UserRole = 'super_admin'): boolean => {
    const found = INITIAL_ADMIN_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser({ ...found, lastLogin: new Date().toISOString() });
      return true;
    }
    // Allow custom login as requested role
    setCurrentUser({
      id: `user-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
    return true;
  };

  const logoutAdmin = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  };

  // Server-side webhook verified vote flow
  const submitVote = async (data: {
    nomineeId: string;
    votesCount: number;
    voterName: string;
    voterEmail: string;
    voterPhone: string;
    currency: Currency;
    gateway: 'paystack' | 'flutterwave';
    promoCode?: string;
  }): Promise<{ success: boolean; transaction: VoteTransaction; error?: string }> => {
    // 1. Validation
    const nominee = nominees.find(n => n.id === data.nomineeId);
    if (!nominee) {
      return { success: false, transaction: {} as VoteTransaction, error: 'Nominee not found' };
    }
    if (!votingSettings.votingOpen) {
      return { success: false, transaction: {} as VoteTransaction, error: 'Voting is currently closed' };
    }

    // Rate limiting / Fraud velocity check
    const recentFromVoter = transactions.filter(
      t => t.voterEmail.toLowerCase() === data.voterEmail.toLowerCase() &&
      Date.now() - new Date(t.createdAt).getTime() < 1000 * 60 * 10
    );
    const isSuspicious = recentFromVoter.length >= votingSettings.fraudAlertThreshold;

    // Calculate exact pricing
    let finalVotes = data.votesCount;
    let basePrice = data.currency === 'USD'
      ? (data.votesCount * votingSettings.basePricePerVoteUSD)
      : (data.votesCount * votingSettings.basePricePerVoteNGN);

    // Apply bundle pricing if matching a bundle
    const matchingBundle = voteBundles.find(b => b.votes === data.votesCount);
    if (matchingBundle) {
      basePrice = data.currency === 'USD' ? matchingBundle.priceUSD : matchingBundle.priceNGN;
    }

    // Apply promo code if provided
    let promoApplied: PromoCode | undefined;
    if (data.promoCode) {
      promoApplied = promoCodes.find(p => p.code.toUpperCase() === data.promoCode?.toUpperCase() && p.isActive);
      if (promoApplied) {
        if (promoApplied.discountPercentage > 0) {
          basePrice = basePrice * (1 - promoApplied.discountPercentage / 100);
        }
        if (promoApplied.bonusVotesPercentage > 0) {
          finalVotes = Math.round(finalVotes * (1 + promoApplied.bonusVotesPercentage / 100));
        }
        // Increment usage
        setPromoCodes(prev =>
          prev.map(p => p.id === promoApplied!.id ? { ...p, usageCount: p.usageCount + 1 } : p)
        );
      }
    }

    // Create unique payment reference
    const refPrefix = data.gateway === 'paystack' ? 'PSTK-IAA' : 'FLW-IAA';
    const reference = `${refPrefix}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const category = categories.find(c => c.id === nominee.categoryId);

    // Create verified transaction (Server webhook simulation)
    const newTx: VoteTransaction = {
      id: `tx-${Date.now()}`,
      reference,
      nomineeId: nominee.id,
      nomineeName: nominee.stageName || nominee.name,
      categoryId: nominee.categoryId,
      categoryName: category?.name || 'Awards Category',
      votesCount: finalVotes,
      amount: Number(basePrice.toFixed(2)),
      currency: data.currency,
      gateway: data.gateway,
      status: 'verified',
      voterName: data.voterName,
      voterEmail: data.voterEmail,
      voterPhone: data.voterPhone,
      voterIp: `197.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      promoCodeUsed: data.promoCode,
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser',
      isSuspicious,
      suspiciousReason: isSuspicious ? 'High-frequency transaction velocity alert (>10 votes in 10 mins)' : undefined
    };

    // Increment nominee votes count in state
    setNominees(prev =>
      prev.map(n => (n.id === nominee.id ? { ...n, votesCount: n.votesCount + finalVotes } : n))
    );

    // Save active voter profile
    updateVoterProfile({
      name: data.voterName,
      email: data.voterEmail,
      phone: data.voterPhone
    });

    // Record transaction
    setTransactions(prev => [newTx, ...prev]);
    triggerTopProgress(400);

    return { success: true, transaction: newTx };
  };

  // Ticket purchasing flow
  const purchaseTickets = async (data: {
    eventId: string;
    tierId: string;
    quantity: number;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    gateway: 'paystack' | 'flutterwave';
    currency: Currency;
  }): Promise<{ success: boolean; order: TicketOrder; error?: string }> => {
    const tier = ticketTiers.find(t => t.id === data.tierId);
    if (!tier) {
      return { success: false, order: {} as TicketOrder, error: 'Ticket tier not found' };
    }
    if (tier.availableQuantity < data.quantity) {
      return { success: false, order: {} as TicketOrder, error: 'Not enough tickets available' };
    }

    const pricePerTicket = data.currency === 'USD' ? tier.priceUSD : tier.priceNGN;
    const totalAmount = pricePerTicket * data.quantity;
    const reference = `IAA-TCK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: TicketOrder = {
      id: `ord-${Date.now()}`,
      reference,
      eventId: data.eventId,
      tierId: tier.id,
      tierName: tier.name,
      quantity: data.quantity,
      totalAmount,
      currency: data.currency,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      buyerPhone: data.buyerPhone,
      gateway: data.gateway,
      status: 'confirmed',
      qrCode: `IAA-VERIFIED-PASS:${reference}:${data.buyerEmail}`,
      createdAt: new Date().toISOString()
    };

    // Update tier inventory
    setTicketTiers(prev =>
      prev.map(t =>
        t.id === tier.id
          ? {
              ...t,
              availableQuantity: t.availableQuantity - data.quantity,
              soldQuantity: t.soldQuantity + data.quantity
            }
          : t
      )
    );

    setTicketOrders(prev => [newOrder, ...prev]);
    triggerTopProgress(400);
    return { success: true, order: newOrder };
  };

  // Admin CRUD implementations
  const addEdition = (item: Omit<Edition, 'id'>) => {
    const newEd: Edition = { ...item, id: `ed-${Date.now()}` };
    setEditions(prev => [newEd, ...prev]);
  };

  const updateEdition = (id: string, item: Partial<Edition>) => {
    setEditions(prev => prev.map(e => (e.id === id ? { ...e, ...item } : e)));
  };

  const deleteEdition = (id: string) => {
    setEditions(prev => prev.filter(e => e.id !== id));
  };

  const addEvent = (item: Omit<Event, 'id'>) => {
    const newEvt: Event = { ...item, id: `evt-${Date.now()}` };
    setEvents(prev => [newEvt, ...prev]);
  };

  const updateEvent = (id: string, item: Partial<Event>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...item } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = (item: Omit<Category, 'id'>) => {
    const newCat: Category = { ...item, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, item: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...item } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addNominee = (item: Omit<Nominee, 'id' | 'votesCount'>) => {
    const newNom: Nominee = {
      ...item,
      id: `nom-${Date.now()}`,
      votesCount: 0
    };
    setNominees(prev => [...prev, newNom]);
  };

  const updateNominee = (id: string, item: Partial<Nominee>) => {
    setNominees(prev => prev.map(n => (n.id === id ? { ...n, ...item } : n)));
  };

  const deleteNominee = (id: string) => {
    setNominees(prev => prev.filter(n => n.id !== id));
  };

  const setNomineeStatus = (id: string, status: Nominee['status']) => {
    setNominees(prev => prev.map(n => (n.id === id ? { ...n, status } : n)));
  };

  const adjustNomineeVotes = (id: string, newVotes: number) => {
    setNominees(prev => prev.map(n => (n.id === id ? { ...n, votesCount: Math.max(0, newVotes) } : n)));
  };

  const updateVotingSettings = (settings: Partial<VotingSettings>) => {
    setVotingSettingsState(prev => ({ ...prev, ...settings }));
  };

  const updateSiteContent = (content: Partial<SiteContent>) => {
    setSiteContentState(prev => ({ ...prev, ...content }));
    if (content.themeMode && (content.themeMode === 'light' || content.themeMode === 'dark')) {
      setThemeModeState(content.themeMode);
      localStorage.setItem(`${STORAGE_KEY}_theme_mode`, content.themeMode);
    }
  };

  const addVoteBundle = (bundle: Omit<VoteBundle, 'id'>) => {
    const newBundle: VoteBundle = { ...bundle, id: `bundle-${Date.now()}` };
    setVoteBundles(prev => [...prev, newBundle]);
  };

  const updateVoteBundle = (id: string, bundle: Partial<VoteBundle>) => {
    setVoteBundles(prev => prev.map(b => (b.id === id ? { ...b, ...bundle } : b)));
  };

  const deleteVoteBundle = (id: string) => {
    setVoteBundles(prev => prev.filter(b => b.id !== id));
  };

  const addPromoCode = (promo: Omit<PromoCode, 'id' | 'usageCount'>) => {
    const newPromo: PromoCode = { ...promo, id: `promo-${Date.now()}`, usageCount: 0 };
    setPromoCodes(prev => [...prev, newPromo]);
  };

  const updatePromoCode = (id: string, promo: Partial<PromoCode>) => {
    setPromoCodes(prev => prev.map(p => (p.id === id ? { ...p, ...promo } : p)));
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes(prev => prev.filter(p => p.id !== id));
  };

  const refundTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx || tx.status === 'refunded') return;
    
    // Deduct votes from nominee
    setNominees(prev =>
      prev.map(n => (n.id === tx.nomineeId ? { ...n, votesCount: Math.max(0, n.votesCount - tx.votesCount) } : n))
    );

    // Update tx status
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'refunded' } : t))
    );
  };

  const addSponsor = (sponsor: Omit<Sponsor, 'id'>) => {
    const newSp: Sponsor = { ...sponsor, id: `sp-${Date.now()}` };
    setSponsors(prev => [...prev, newSp]);
  };

  const deleteSponsor = (id: string) => {
    setSponsors(prev => prev.filter(s => s.id !== id));
  };

  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { ...faq, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, newFaq]);
  };

  const deleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const addGalleryItem = (item: Omit<GalleryMedia, 'id'>) => {
    const newGal: GalleryMedia = { ...item, id: `gal-${Date.now()}` };
    setGallery(prev => [newGal, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const addTicketTier = (tier: Omit<TicketTier, 'id' | 'soldQuantity'>) => {
    const newTier: TicketTier = { ...tier, id: `tier-${Date.now()}`, soldQuantity: 0 };
    setTicketTiers(prev => [...prev, newTier]);
  };

  const updateTicketTier = (id: string, tier: Partial<TicketTier>) => {
    setTicketTiers(prev => prev.map(t => (t.id === id ? { ...t, ...tier } : t)));
  };

  const deleteTicketTier = (id: string) => {
    setTicketTiers(prev => prev.filter(t => t.id !== id));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setEditions(INITIAL_EDITIONS);
    setEvents(INITIAL_EVENTS);
    setCategories(INITIAL_CATEGORIES);
    setNominees(INITIAL_NOMINEES);
    setVoteBundles(INITIAL_VOTE_BUNDLES);
    setPromoCodes(INITIAL_PROMO_CODES);
    setTransactions(INITIAL_TRANSACTIONS);
    setTicketTiers(INITIAL_TICKET_TIERS);
    setTicketOrders([]);
    setSponsors(INITIAL_SPONSORS);
    setFaqs(INITIAL_FAQS);
    setGallery(INITIAL_GALLERY);
    setVotingSettingsState(INITIAL_VOTING_SETTINGS);
    setSiteContentState(INITIAL_SITE_CONTENT);
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        formatMoney,
        convertNGNToUSD,
        editions,
        setEditions,
        events,
        setEvents,
        categories,
        setCategories,
        nominees,
        setNominees,
        voteBundles,
        setVoteBundles,
        promoCodes,
        setPromoCodes,
        transactions,
        ticketTiers,
        setTicketTiers,
        ticketOrders,
        sponsors,
        setSponsors,
        faqs,
        setFaqs,
        gallery,
        setGallery,
        adminUsers,
        setAdminUsers,
        votingSettings,
        siteContent,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        voterProfile,
        updateVoterProfile,
        currentUser,
        isAuthenticated: !!currentUser,
        loginAdmin,
        logoutAdmin,
        login: (email: string) => loginAdmin(email),
        logout: () => logoutAdmin(),
        switchRole,
        submitVote,
        purchaseTickets,
        addEdition,
        updateEdition,
        deleteEdition,
        addEvent,
        updateEvent,
        deleteEvent,
        addCategory,
        updateCategory,
        deleteCategory,
        addNominee,
        updateNominee,
        deleteNominee,
        setNomineeStatus,
        adjustNomineeVotes,
        updateVotingSettings,
        updateSiteContent,
        addVoteBundle,
        updateVoteBundle,
        deleteVoteBundle,
        addPromoCode,
        updatePromoCode,
        deletePromoCode,
        refundTransaction,
        addSponsor,
        deleteSponsor,
        addFAQ,
        deleteFAQ,
        addGalleryItem,
        deleteGalleryItem,
        addTicketTier,
        updateTicketTier,
        deleteTicketTier,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
