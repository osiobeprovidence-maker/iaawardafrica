export type Currency = 'NGN' | 'USD';

export type UserRole = 'super_admin' | 'staff' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Edition {
  id: string;
  number: number;
  name: string; // e.g. "7th Edition"
  theme: string; // "The African Cultural Fashion Edition"
  year: number;
  status: 'upcoming' | 'live' | 'completed';
  isCurrent: boolean;
  votingOpen: boolean;
  bannerImage: string;
  description: string;
}

export interface Event {
  id: string;
  editionId: string;
  title: string;
  date: string; // e.g. "2026-11-28T18:00:00Z"
  venue: string;
  city: string;
  country: string;
  description: string;
  bannerImage: string;
  status: 'upcoming' | 'live' | 'past';
  ticketSalesOpen: boolean;
}

export interface Category {
  id: string;
  code: string; // e.g. "CFD-01"
  name: string;
  description: string;
  editionId: string;
  eventId: string;
  iconName?: string;
  isActive: boolean;
  order: number;
}

export interface Nominee {
  id: string;
  name: string;
  stageName?: string;
  categoryId: string;
  editionId: string;
  bio: string;
  photoUrl: string;
  country: string;
  votesCount: number;
  status: 'approved' | 'pending' | 'rejected';
  featured: boolean;
  socials: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    website?: string;
  };
}

export interface VoteBundle {
  id: string;
  votes: number;
  priceNGN: number;
  priceUSD: number;
  popular?: boolean;
  label?: string;
  discountPercentage?: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  bonusVotesPercentage: number;
  isActive: boolean;
  usageCount: number;
  expiresAt: string;
}

export interface VoteTransaction {
  id: string;
  reference: string;
  nomineeId: string;
  nomineeName: string;
  categoryId: string;
  categoryName: string;
  votesCount: number;
  amount: number;
  currency: Currency;
  gateway: 'paystack' | 'flutterwave';
  status: 'verified' | 'pending' | 'failed' | 'refunded';
  voterName: string;
  voterEmail: string;
  voterPhone: string;
  voterIp: string;
  promoCodeUsed?: string;
  createdAt: string;
  verifiedAt?: string;
  deviceInfo?: string;
  isSuspicious?: boolean;
  suspiciousReason?: string;
}

export interface VoterProfile {
  name: string;
  email: string;
  phone: string;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description: string;
  priceNGN: number;
  priceUSD: number;
  availableQuantity: number;
  soldQuantity: number;
  perks: string[];
  isActive: boolean;
}

export interface TicketOrder {
  id: string;
  reference: string;
  eventId: string;
  tierId: string;
  tierName: string;
  quantity: number;
  totalAmount: number;
  currency: Currency;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  gateway: 'paystack' | 'flutterwave';
  status: 'confirmed' | 'pending' | 'cancelled';
  qrCode: string;
  createdAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'headline' | 'platinum' | 'gold' | 'silver' | 'media';
  logoUrl: string;
  websiteUrl: string;
  description?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'voting' | 'event' | 'tickets' | 'nominations';
}

export interface GalleryMedia {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  edition: string;
  tag: 'red-carpet' | 'awards-night' | 'cultural-fashion' | 'backstage';
  date: string;
}

export interface VotingSettings {
  basePricePerVoteNGN: number;
  basePricePerVoteUSD: number;
  votingOpen: boolean;
  votingStartTime: string;
  votingEndTime: string;
  showPublicVoteCounts: boolean;
  maxVotesPerTransaction: number;
  dailyVoterLimit: number;
  fraudAlertThreshold: number; // votes in 10 mins from same IP
  usdToNgnRate: number;
}

export type ThemeMode = 'light' | 'dark';

export interface SiteContent {
  // Theme Mode & Cosmetics
  themeMode?: ThemeMode;

  // Brand & Logo
  brandName: string;
  tagline: string;
  logoUrl: string;
  logoHeight?: number;
  faviconUrl?: string;

  // Cosmetics & Theme Colors
  primaryColor?: string;
  goldAccent?: string;
  darkBg?: string;

  // Announcement Bar
  announcementText: string;
  announcementActive: boolean;

  // Hero Section
  heroBadge?: string;
  heroHeading: string;
  heroSubheading: string;
  heroBannerImage?: string;
  heroPrimaryCtaText?: string;
  heroSecondaryCtaText?: string;

  // About Page Write-up & Media
  aboutSubtitle?: string;
  aboutHeadline?: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  aboutBannerImage?: string;

  // Footer & Legal Write-up
  footerDescription?: string;
  copyrightText?: string;

  // Nomination & Voting Guidelines
  votingGuidelinesText?: string;

  // Contact Details
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;

  // Social Links
  socialLinks: {
    instagram: string;
    twitter: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    whatsapp: string;
  };

  // Payment & Email Gateways
  paystackPublicKey: string;
  paystackSecretKey?: string;
  flutterwavePublicKey: string;
  flutterwaveSecretKey?: string;
  emailSenderName?: string;
  emailSenderAddress?: string;

  // Search Engine Optimization (SEO) & Social Meta
  seo?: SeoSettings;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogType: 'website' | 'article' | 'event';
  twitterCard: 'summary_large_image' | 'summary';
  twitterSite: string;
  twitterCreator: string;
  robotsDirective: 'index, follow' | 'noindex, nofollow' | 'noindex, follow' | 'index, nofollow';
  enableJsonLd: boolean;
  schemaType: 'Event' | 'Organization' | 'WebApplication' | 'Custom';
  organizationName?: string;
  eventName?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventLocationName?: string;
  eventLocationAddress?: string;
  customJsonLd?: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  googleAnalyticsId?: string;
}
