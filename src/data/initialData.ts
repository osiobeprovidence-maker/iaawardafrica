import {
  Edition,
  Event,
  Category,
  Nominee,
  VoteBundle,
  PromoCode,
  VoteTransaction,
  TicketTier,
  Sponsor,
  FAQItem,
  GalleryMedia,
  VotingSettings,
  SiteContent,
  AdminUser,
} from '../types';

export const INITIAL_EDITIONS: Edition[] = [
  {
    id: 'ed-7',
    number: 7,
    name: '7th Edition',
    theme: 'The African Cultural Fashion Edition',
    year: 2026,
    status: 'live',
    isCurrent: true,
    votingOpen: true,
    bannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
    description: 'Celebrating the majesty of indigenous African textiles, haute couture silhouettes, and pan-African fashion icons redefining global luxury.'
  },
  {
    id: 'ed-6',
    number: 6,
    name: '6th Edition',
    theme: 'The Renaissance of African Cinema & Sound',
    year: 2025,
    status: 'completed',
    isCurrent: false,
    votingOpen: false,
    bannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
    description: 'Honoring visionary filmmakers, afro-fusion composers, and storytellers who catapulted African cinema onto international stages.'
  },
  {
    id: 'ed-5',
    number: 5,
    name: '5th Edition',
    theme: 'The Golden Decade of Young African Icons',
    year: 2024,
    status: 'completed',
    isCurrent: false,
    votingOpen: false,
    bannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
    description: 'Recognizing trailblazers under 35 across creative arts, sports diplomacy, tech innovation, and social impact.'
  },
  {
    id: 'ed-4',
    number: 4,
    name: '4th Edition',
    theme: 'Echoes of Royalty & Heritage',
    year: 2023,
    status: 'completed',
    isCurrent: false,
    votingOpen: false,
    bannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
    description: 'A celebration of dynastic African folklore, heritage preservation, and classical African performing arts.'
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-gala-2026',
    editionId: 'ed-7',
    title: 'Iconic Awards Africa 7th Gala & Cultural Runway',
    date: '2026-11-28T18:00:00Z',
    venue: 'Grand Ballroom, Eko Hotels & Suites, Victoria Island',
    city: 'Lagos',
    country: 'Nigeria',
    description: 'The pinnacle night of African cultural elegance. 1,500 distinguished dignitaries, red carpet arrivals, live orchestral afro-soul performances, and the crowning of Africa\'s most iconic leaders and cultural visionaries.',
    bannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
    status: 'upcoming',
    ticketSalesOpen: true
  },
  {
    id: 'evt-nominee-party-2026',
    editionId: 'ed-7',
    title: 'IAA Nominees Soirée & Press Preview',
    date: '2026-10-15T19:00:00Z',
    venue: 'The Wings Rooftop Pavilion, Ozumba Mbadiwe',
    city: 'Lagos',
    country: 'Nigeria',
    description: 'An exclusive cocktail celebration bringing together nominees, category sponsors, international fashion editors, and past IAA laureates.',
    bannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
    status: 'upcoming',
    ticketSalesOpen: false
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion-designer',
    code: 'IAA-FD-01',
    name: 'African Cultural Fashion Designer of the Year',
    description: 'Honoring bespoke African couture designers incorporating indigenous textiles (Aso-Oke, Kente, Bogolan, Barkcloth) into international luxury.',
    editionId: 'ed-7',
    eventId: 'evt-gala-2026',
    iconName: 'Scissors',
    isActive: true,
    order: 1
  },
  {
    id: 'cat-cultural-icon',
    code: 'IAA-CI-02',
    name: 'Pan-African Cultural Icon of the Year',
    description: 'The highest civilian honor presented to an individual whose cultural contributions have globally redefined African excellence.',
    editionId: 'ed-7',
    eventId: 'evt-gala-2026',
    iconName: 'Crown',
    isActive: true,
    order: 2
  },
  {
    id: 'cat-red-carpet-style',
    code: 'IAA-RC-03',
    name: 'Best Red Carpet Cultural Style (Male & Female)',
    description: 'Celebrating red-carpet luminaries whose ceremonial appearances embody royal African elegance and bespoke craftsmanship.',
    editionId: 'ed-7',
    eventId: 'evt-gala-2026',
    iconName: 'Award',
    isActive: true,
    order: 3
  },
  {
    id: 'cat-music-ambassador',
    code: 'IAA-MA-04',
    name: 'Afrobeats Cultural Ambassador of the Year',
    description: 'Artistes who champion African pride, traditional sonic rhythms, and visual heritage on the most prestigious global stages.',
    editionId: 'ed-7',
    eventId: 'evt-gala-2026',
    iconName: 'Music',
    isActive: true,
    order: 4
  },
  {
    id: 'cat-cinema-trailblazer',
    code: 'IAA-CT-05',
    name: 'Nollywood Cultural Trailblazer',
    description: 'Screen actors and directors who authentically depict indigenous African histories and modern pan-African narratives.',
    editionId: 'ed-7',
    eventId: 'evt-gala-2026',
    iconName: 'Film',
    isActive: true,
    order: 5
  },
  {
    id: 'cat-textile-innovator',
    code: 'IAA-TI-06',
    name: 'Indigenous Textile Artisan & Innovator',
    description: 'Pioneering weaving communities and fabric innovators sustaining centuries-old loom heritage with sustainable modern techniques.',
    editionId: 'ed-7',
    eventId: 'evt-gala-2026',
    iconName: 'Layers',
    isActive: true,
    order: 6
  }
];

export const INITIAL_NOMINEES: Nominee[] = [
  {
    id: 'nom-1',
    name: 'Folashade Adeleke',
    stageName: 'Folashade Atelier',
    categoryId: 'cat-fashion-designer',
    editionId: 'ed-7',
    country: 'Nigeria',
    bio: 'Pioneering haute couture designer celebrated for reviving 19th-century royal Yoruba Aso-Oke weaves on Paris & Milan Fashion Week runways.',
    photoUrl: '/src/assets/images/nominee_fashion_designer_1790253812536.jpg',
    votesCount: 14820,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@folashade.atelier',
      twitter: '@folashade_a',
      website: 'https://folashadeatelier.africa'
    }
  },
  {
    id: 'nom-2',
    name: 'Kwame Osei Boateng',
    stageName: 'K. Osei Couture',
    categoryId: 'cat-fashion-designer',
    editionId: 'ed-7',
    country: 'Ghana',
    bio: 'Kumasi-born master tailor whose architectural Bonwire Kente ceremonial robes have dressed African heads of state and global luminaries.',
    photoUrl: '/src/assets/images/nominee_fashion_designer_1790253812536.jpg',
    votesCount: 12450,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@kosei_couture',
      twitter: '@k_osei'
    }
  },
  {
    id: 'nom-3',
    name: 'Amina Al-Mansoor',
    stageName: 'Maison Al-Mansoor',
    categoryId: 'cat-fashion-designer',
    editionId: 'ed-7',
    country: 'Morocco',
    bio: 'Master of ornate Maghrebi silk embroidery, hand-beaded caftans, and sustainable Berber wool silhouettes.',
    photoUrl: '/src/assets/images/nominee_fashion_designer_1790253812536.jpg',
    votesCount: 9780,
    status: 'approved',
    featured: false,
    socials: {
      instagram: '@maisonalmansoor'
    }
  },
  {
    id: 'nom-4',
    name: 'Tiwa Savage-Balogun',
    stageName: 'Tiwa Savage',
    categoryId: 'cat-cultural-icon',
    editionId: 'ed-7',
    country: 'Nigeria',
    bio: 'The Queen of Afrobeats whose regal African ceremonial styling at historic global events has made her an enduring global icon of African pride.',
    photoUrl: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg',
    votesCount: 22400,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@tiwasavage',
      twitter: '@tiwasavage',
      tiktok: '@tiwasavage'
    }
  },
  {
    id: 'nom-5',
    name: 'Idris Elba OBE',
    stageName: 'Idris Elba',
    categoryId: 'cat-cultural-icon',
    editionId: 'ed-7',
    country: 'Sierra Leone / Ghana',
    bio: 'Global actor, director, and creative investor actively building film infrastructure and cultural creative economies across the African continent.',
    photoUrl: '/src/assets/images/nominee_music_artist_1790253823714.jpg',
    votesCount: 18910,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@idriselba',
      twitter: '@idriselba'
    }
  },
  {
    id: 'nom-6',
    name: 'Lupita Nyong\'o',
    stageName: 'Lupita Nyong\'o',
    categoryId: 'cat-cultural-icon',
    editionId: 'ed-7',
    country: 'Kenya',
    bio: 'Oscar-winning actress and author known worldwide for championing African heritage, indigenous hair artistry, and African literature.',
    photoUrl: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg',
    votesCount: 17350,
    status: 'approved',
    featured: false,
    socials: {
      instagram: '@lupitanyongo',
      twitter: '@lupita_nyongo'
    }
  },
  {
    id: 'nom-7',
    name: 'Ebuka Obi-Uchendu',
    stageName: 'Ebuka',
    categoryId: 'cat-red-carpet-style',
    editionId: 'ed-7',
    country: 'Nigeria',
    bio: 'Unrivaled red-carpet icon whose structural Agbadas and experimental indigenous fashion ensembles continually shatter internet records.',
    photoUrl: '/src/assets/images/nominee_music_artist_1790253823714.jpg',
    votesCount: 15630,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@ebuka',
      twitter: '@ebuka'
    }
  },
  {
    id: 'nom-8',
    name: 'Bonang Matheba',
    stageName: 'Queen B*',
    categoryId: 'cat-red-carpet-style',
    editionId: 'ed-7',
    country: 'South Africa',
    bio: 'Television host, media entrepreneur, and style titan known across Africa for unforgettable haute-couture gala appearances.',
    photoUrl: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg',
    votesCount: 14190,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@bonang_m',
      twitter: '@bonang_m'
    }
  },
  {
    id: 'nom-9',
    name: 'Damini Ogulu',
    stageName: 'Burna Boy',
    categoryId: 'cat-music-ambassador',
    editionId: 'ed-7',
    country: 'Nigeria',
    bio: 'Grammy-winning African Giant bridging ancestral Fela Kuti afrobeat instrumentation with stadium-rocking Pan-African consciousness.',
    photoUrl: '/src/assets/images/nominee_music_artist_1790253823714.jpg',
    votesCount: 28940,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@burnaboygram',
      twitter: '@burnaboy'
    }
  },
  {
    id: 'nom-10',
    name: 'Angelique Kidjo',
    stageName: 'Angelique Kidjo',
    categoryId: 'cat-music-ambassador',
    editionId: 'ed-7',
    country: 'Benin Republic',
    bio: '5-time Grammy laureate, UNICEF Goodwill Ambassador, and undisputed musical matriarch of West African rhythms and cultural dignity.',
    photoUrl: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg',
    votesCount: 21300,
    status: 'approved',
    featured: false,
    socials: {
      instagram: '@angeliquekidjo',
      twitter: '@angeliquekidjo'
    }
  },
  {
    id: 'nom-11',
    name: 'Kunle Afolayan',
    stageName: 'Kunle Afolayan',
    categoryId: 'cat-cinema-trailblazer',
    editionId: 'ed-7',
    country: 'Nigeria',
    bio: 'Acclaimed auteur filmmaker and cultural archivist behind landmark historical epics celebrating pre-colonial African kingdoms and folklore.',
    photoUrl: '/src/assets/images/nominee_music_artist_1790253823714.jpg',
    votesCount: 11920,
    status: 'approved',
    featured: true,
    socials: {
      instagram: '@kunleafo',
      twitter: '@kunleafolayan'
    }
  },
  {
    id: 'nom-12',
    name: 'Nse Ikpe-Etim',
    stageName: 'Nse Ikpe-Etim',
    categoryId: 'cat-cinema-trailblazer',
    editionId: 'ed-7',
    country: 'Nigeria',
    bio: 'Commanding actress whose nuanced portrayals of African matriarchs have earned multiple continental accolades and international acclaim.',
    photoUrl: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg',
    votesCount: 10450,
    status: 'approved',
    featured: false,
    socials: {
      instagram: '@nseikpeetim'
    }
  }
];

export const INITIAL_VOTE_BUNDLES: VoteBundle[] = [
  {
    id: 'bundle-single',
    votes: 1,
    priceNGN: 100,
    priceUSD: 0.15,
    label: 'Single Vote'
  },
  {
    id: 'bundle-10',
    votes: 10,
    priceNGN: 950,
    priceUSD: 1.40,
    label: 'Fan Pack (10 Votes)',
    discountPercentage: 5
  },
  {
    id: 'bundle-50',
    votes: 50,
    priceNGN: 4500,
    priceUSD: 6.50,
    label: 'Supporter Bundle (50 Votes)',
    popular: true,
    discountPercentage: 10
  },
  {
    id: 'bundle-100',
    votes: 100,
    priceNGN: 8500,
    priceUSD: 12.00,
    label: 'Champion Pack (100 Votes)',
    discountPercentage: 15
  },
  {
    id: 'bundle-500',
    votes: 500,
    priceNGN: 40000,
    priceUSD: 55.00,
    label: 'Patron Super Bundle (500 Votes)',
    discountPercentage: 20
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'VIPAFRICA',
    discountPercentage: 10,
    bonusVotesPercentage: 10,
    isActive: true,
    usageCount: 142,
    expiresAt: '2026-12-31'
  },
  {
    id: 'promo-2',
    code: 'FASHION7',
    discountPercentage: 15,
    bonusVotesPercentage: 0,
    isActive: true,
    usageCount: 89,
    expiresAt: '2026-11-28'
  },
  {
    id: 'promo-3',
    code: 'LAGOSGALA',
    discountPercentage: 5,
    bonusVotesPercentage: 20,
    isActive: true,
    usageCount: 54,
    expiresAt: '2026-10-31'
  }
];

export const INITIAL_TRANSACTIONS: VoteTransaction[] = [
  {
    id: 'tx-2001',
    reference: 'PSTK-IAA-892011-4821',
    nomineeId: 'nom-1',
    nomineeName: 'Folashade Adeleke',
    categoryId: 'cat-fashion-designer',
    categoryName: 'African Cultural Fashion Designer of the Year',
    votesCount: 250,
    amount: 20000,
    currency: 'NGN',
    gateway: 'paystack',
    status: 'verified',
    voterName: 'Rezzy Rider',
    voterEmail: 'riderezzy@gmail.com',
    voterPhone: '+2348023456789',
    voterIp: '102.89.44.18',
    promoCodeUsed: 'VIPAFRICA',
    createdAt: '2026-09-24T05:30:00Z',
    verifiedAt: '2026-09-24T05:30:04Z',
    deviceInfo: 'Desktop Chrome / MacOS'
  },
  {
    id: 'tx-2002',
    reference: 'FLW-IAA-771922-3104',
    nomineeId: 'nom-9',
    nomineeName: 'Damini Ogulu (Burna Boy)',
    categoryId: 'cat-music-ambassador',
    categoryName: 'Afrobeats Cultural Ambassador of the Year',
    votesCount: 500,
    amount: 40000,
    currency: 'NGN',
    gateway: 'flutterwave',
    status: 'verified',
    voterName: 'Rezzy Rider',
    voterEmail: 'riderezzy@gmail.com',
    voterPhone: '+2348023456789',
    voterIp: '102.89.44.18',
    createdAt: '2026-09-23T18:14:00Z',
    verifiedAt: '2026-09-23T18:14:05Z',
    deviceInfo: 'Desktop Chrome / MacOS'
  },
  {
    id: 'tx-2003',
    reference: 'PSTK-IAA-651049-9022',
    nomineeId: 'nom-5',
    nomineeName: 'Lupita Nyong\'o',
    categoryId: 'cat-cultural-icon',
    categoryName: 'Pan-African Cultural Icon of the Year',
    votesCount: 50,
    amount: 4500,
    currency: 'NGN',
    gateway: 'paystack',
    status: 'verified',
    voterName: 'Rezzy Rider',
    voterEmail: 'riderezzy@gmail.com',
    voterPhone: '+2348023456789',
    voterIp: '102.89.44.18',
    createdAt: '2026-09-22T11:45:00Z',
    verifiedAt: '2026-09-22T11:45:03Z',
    deviceInfo: 'Mobile Safari / iOS 17'
  },
  {
    id: 'tx-1001',
    reference: 'IAA-VOTE-983101',
    nomineeId: 'nom-1',
    nomineeName: 'Folashade Adeleke',
    categoryId: 'cat-fashion-designer',
    categoryName: 'African Cultural Fashion Designer of the Year',
    votesCount: 100,
    amount: 8500,
    currency: 'NGN',
    gateway: 'paystack',
    status: 'verified',
    voterName: 'Chidinma Nwosu',
    voterEmail: 'chidinma.nwosu@gmail.com',
    voterPhone: '+2348031234567',
    voterIp: '102.89.42.11',
    createdAt: '2026-09-24T04:12:00Z',
    verifiedAt: '2026-09-24T04:12:04Z',
    deviceInfo: 'iPhone 15 Pro / Safari'
  },
  {
    id: 'tx-1002',
    reference: 'IAA-VOTE-983102',
    nomineeId: 'nom-9',
    nomineeName: 'Damini Ogulu (Burna Boy)',
    categoryId: 'cat-music-ambassador',
    categoryName: 'Afrobeats Cultural Ambassador of the Year',
    votesCount: 500,
    amount: 40000,
    currency: 'NGN',
    gateway: 'flutterwave',
    status: 'verified',
    voterName: 'Tariq Mensah',
    voterEmail: 'tariq.mensah@accragroup.gh',
    voterPhone: '+233244123890',
    voterIp: '154.160.22.4',
    createdAt: '2026-09-24T04:45:00Z',
    verifiedAt: '2026-09-24T04:45:06Z',
    deviceInfo: 'MacBook Pro / Chrome'
  },
  {
    id: 'tx-1003',
    reference: 'IAA-VOTE-983103',
    nomineeId: 'nom-4',
    nomineeName: 'Tiwa Savage',
    categoryId: 'cat-cultural-icon',
    categoryName: 'Pan-African Cultural Icon of the Year',
    votesCount: 50,
    amount: 6.50,
    currency: 'USD',
    gateway: 'paystack',
    status: 'verified',
    voterName: 'Amara Diop',
    voterEmail: 'amara.diop@dakar-arts.sn',
    voterPhone: '+221776543210',
    voterIp: '197.149.200.12',
    createdAt: '2026-09-24T05:02:00Z',
    verifiedAt: '2026-09-24T05:02:03Z',
    deviceInfo: 'Android 14 / Chrome'
  },
  {
    id: 'tx-1004',
    reference: 'IAA-VOTE-983104',
    nomineeId: 'nom-7',
    nomineeName: 'Ebuka Obi-Uchendu',
    categoryId: 'cat-red-carpet-style',
    categoryName: 'Best Red Carpet Cultural Style',
    votesCount: 500,
    amount: 40000,
    currency: 'NGN',
    gateway: 'paystack',
    status: 'verified',
    voterName: 'Babatunde Alabi',
    voterEmail: 'b.alabi@yahooinvest.ng',
    voterPhone: '+2348123456789',
    voterIp: '105.112.80.3',
    createdAt: '2026-09-24T05:15:00Z',
    verifiedAt: '2026-09-24T05:15:05Z',
    deviceInfo: 'Windows PC / Edge'
  },
  {
    id: 'tx-1005',
    reference: 'IAA-VOTE-983105',
    nomineeId: 'nom-2',
    nomineeName: 'Kwame Osei Boateng',
    categoryId: 'cat-fashion-designer',
    categoryName: 'African Cultural Fashion Designer of the Year',
    votesCount: 10,
    amount: 950,
    currency: 'NGN',
    gateway: 'flutterwave',
    status: 'verified',
    voterName: 'Yaa Asantewaa',
    voterEmail: 'yaa.asantewaa@gmail.com',
    voterPhone: '+233501234567',
    voterIp: '41.215.170.88',
    createdAt: '2026-09-24T05:22:00Z',
    verifiedAt: '2026-09-24T05:22:04Z',
    deviceInfo: 'Samsung Galaxy S24 / Chrome'
  }
];

export const INITIAL_TICKET_TIERS: TicketTier[] = [
  {
    id: 'tier-regular',
    eventId: 'evt-gala-2026',
    name: 'Cultural Enthusiast (Regular)',
    description: 'Entry to main auditorium, access to the Cultural Fashion Showcase runway, commemorative 7th edition programme booklet, and cocktail reception.',
    priceNGN: 25000,
    priceUSD: 35,
    availableQuantity: 500,
    soldQuantity: 312,
    perks: ['Auditorium Seating', 'Cultural Runway Access', 'Official Event Programme', 'Welcome Cocktail Reception'],
    isActive: true
  },
  {
    id: 'tier-vip',
    eventId: 'evt-gala-2026',
    name: 'VIP Red Carpet Experience',
    description: 'Priority Red Carpet step-and-repeat photography, front-row fashion runway seating, complimentary vintage champagne service, and IAA luxury gift hamper.',
    priceNGN: 75000,
    priceUSD: 100,
    availableQuantity: 200,
    soldQuantity: 158,
    perks: ['Red Carpet Photo-Op', 'Front Row Runway Seating', 'Continuous Champagne & Hors d\'oeuvres', 'Deluxe IAA Swag Hamper', 'VIP Lounge Access'],
    isActive: true
  },
  {
    id: 'tier-vvip-table',
    eventId: 'evt-gala-2026',
    name: 'VVIP Royal Table (Seating for 8)',
    description: 'Dedicated bespoke table on the presidential tier, 5-course Pan-African gourmet dinner, private sommelier, personal security escort, and meet-and-greet with nominees.',
    priceNGN: 600000,
    priceUSD: 800,
    availableQuantity: 25,
    soldQuantity: 19,
    perks: ['Reserved Royal Table for 8', '5-Course Gourmet Banquet', 'Personal Sommelier & Vintage Wines', 'Exclusive Backstage Access', 'Corporate Brand Mention'],
    isActive: true
  }
];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sp-1',
    name: 'GTCO (Guaranty Trust)',
    tier: 'headline',
    logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=300&q=80',
    websiteUrl: 'https://gtcoplc.com',
    description: 'Official Headline Banking Partner empowering African creative entrepreneurs.'
  },
  {
    id: 'sp-2',
    name: 'Paystack by Stripe',
    tier: 'platinum',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80',
    websiteUrl: 'https://paystack.com',
    description: 'Official Digital Payments Infrastructure Provider.'
  },
  {
    id: 'sp-3',
    name: 'Flutterwave',
    tier: 'platinum',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
    websiteUrl: 'https://flutterwave.com',
    description: 'Official Pan-African Cross-Border Payment Partner.'
  },
  {
    id: 'sp-4',
    name: 'BellaNaija Style',
    tier: 'media',
    logoUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=300&q=80',
    websiteUrl: 'https://bellanaijastyle.com',
    description: 'Leading Pan-African Fashion & Lifestyle Media Host.'
  },
  {
    id: 'sp-5',
    name: 'Arise News Channel',
    tier: 'media',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
    websiteUrl: 'https://arise.tv',
    description: 'Global Broadcast Partner bringing IAA to 50+ countries.'
  },
  {
    id: 'sp-6',
    name: 'Lagos State Ministry of Tourism, Arts & Culture',
    tier: 'gold',
    logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
    websiteUrl: 'https://tourism.lagosstate.gov.ng',
    description: 'Host City Cultural Destination Partner.'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'voting',
    question: 'How do public votes work and when are they counted?',
    answer: 'Every paid vote counts immediately after server-side webhook verification from our licensed payment gateways (Paystack or Flutterwave). Nominee tallies update in real time across the official leaderboard.'
  },
  {
    id: 'faq-2',
    category: 'voting',
    question: 'Can I vote from outside Nigeria?',
    answer: 'Yes! Voters worldwide can toggle currency to USD and pay seamlessly via international debit/credit cards, Apple Pay, or bank transfers supported through Flutterwave and Paystack.'
  },
  {
    id: 'faq-3',
    category: 'voting',
    question: 'Are there discounts for bulk votes?',
    answer: 'Yes, we offer vote bundles starting at 10 votes up to 500 votes with savings up to 20%. You can also apply official promotional codes during checkout.'
  },
  {
    id: 'faq-4',
    category: 'event',
    question: 'What is the dress code for the 7th Edition Gala Night?',
    answer: 'The dress code is "Regal African Cultural Haute Couture / Black-Tie with Indigenous Textiles". Guests are encouraged to showcase authentic fabrics such as Aso-Oke, Kente, Akwete, Ankara, and Agbada luxury tailoring.'
  },
  {
    id: 'faq-5',
    category: 'tickets',
    question: 'How do I receive my event gala ticket?',
    answer: 'Upon successful payment verification, your personalized digital pass featuring an encrypted security QR code is generated instantly. A backup copy is dispatched immediately to your email address.'
  },
  {
    id: 'faq-6',
    category: 'nominations',
    question: 'How are IAA nominees shortlisted?',
    answer: 'Nominees undergo a rigorous multi-stage vetting process by the Iconic Awards Africa Academy comprising veteran fashion critics, cultural historians, and media executives before being presented for public voting.'
  }
];

export const INITIAL_GALLERY: GalleryMedia[] = [
  {
    id: 'gal-1',
    title: 'The 7th Edition Trophy Unveiling',
    type: 'image',
    url: '/src/assets/images/iaa_gold_trophy_1790253843668.jpg',
    edition: '7th Edition',
    tag: 'awards-night',
    date: '2026-08-10'
  },
  {
    id: 'gal-2',
    title: 'Red Carpet Royal Arrivals & Couture Silhouettes',
    type: 'image',
    url: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
    edition: '7th Edition',
    tag: 'red-carpet',
    date: '2026-08-12'
  },
  {
    id: 'gal-3',
    title: 'Master Weaver Showcase - Yoruba Aso-Oke & Bonwire Kente',
    type: 'image',
    url: '/src/assets/images/nominee_fashion_designer_1790253812536.jpg',
    edition: '7th Edition',
    tag: 'cultural-fashion',
    date: '2026-08-15'
  },
  {
    id: 'gal-4',
    title: 'Pan-African Icon Stage Honors & Keynote',
    type: 'image',
    url: '/src/assets/images/nominee_cultural_icon_1790253834830.jpg',
    edition: '6th Edition',
    tag: 'awards-night',
    date: '2025-11-29'
  },
  {
    id: 'gal-5',
    title: 'Afrobeats Symphony Performance on the Golden Stage',
    type: 'image',
    url: '/src/assets/images/nominee_music_artist_1790253823714.jpg',
    edition: '6th Edition',
    tag: 'backstage',
    date: '2025-11-29'
  }
];

export const INITIAL_VOTING_SETTINGS: VotingSettings = {
  basePricePerVoteNGN: 100,
  basePricePerVoteUSD: 0.15,
  votingOpen: true,
  votingStartTime: '2026-08-01T00:00:00Z',
  votingEndTime: '2026-11-27T23:59:59Z',
  showPublicVoteCounts: true,
  maxVotesPerTransaction: 5000,
  dailyVoterLimit: 20000,
  fraudAlertThreshold: 10,
  usdToNgnRate: 1550
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  themeMode: 'light',
  brandName: 'Iconic Awards Africa',
  tagline: 'The Continental Crown of African Culture & Haute Couture',
  logoUrl: '/iaa-logo.svg',
  logoHeight: 48,
  faviconUrl: '/iaa-logo.svg',

  primaryColor: '#E8471C',
  goldAccent: '#C9971C',
  darkBg: '#0B0B0B',

  announcementText: 'VOTING IS OFFICIALLY LIVE FOR THE 7TH EDITION • GALA NIGHT TAKES PLACE NOV 28, 2026 IN LAGOS',
  announcementActive: true,

  heroBadge: 'The 7th Edition · African Cultural Fashion & Honors Gala',
  heroHeading: 'Celebrating the Icons Shaping African Culture & Global Couture',
  heroSubheading: 'Iconic Awards Africa (IAA) 7th Edition celebrates visionary designers, cultural leaders, music ambassadors, and cinematic legends redefining African excellence.',
  heroBannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',
  heroPrimaryCtaText: 'Vote For Your Icons Now',
  heroSecondaryCtaText: 'Reserve Gala Night Tickets',

  aboutSubtitle: 'Institutional Heritage',
  aboutHeadline: 'Crowning African Cultural Excellence Since 2020',
  aboutStory: 'Founded to honor the indomitable soul and aesthetic ingenuity of the African continent, Iconic Awards Africa (IAA) stands as the definitive continental honors stage. Each year, millions of cultural enthusiasts cast verified votes to crown visionaries whose works command international respect while remaining rooted in ancestral heritage.',
  aboutMission: 'To preserve, elevate, and institutionalize African creative brilliance through world-class recognition, ethical voting transparency, and cultural preservation.',
  aboutVision: 'A united, prosperous creative Africa where indigenous artisans, high-fashion houses, and performing icons dictate global cultural narratives.',
  aboutBannerImage: '/src/assets/images/iaa_hero_gala_1790253803537.jpg',

  footerDescription: 'Iconic Awards Africa (IAA) is the continent’s premier cultural honors institution celebrating extraordinary African excellence across haute couture fashion, arts, entertainment, and transformative leadership.',
  copyrightText: '© 2026 Iconic Awards Africa (IAA) Secretariat. All Rights Reserved.',
  votingGuidelinesText: 'Every vote cast is cryptographically recorded with cryptographic receipt hash, voter IP verification, and audited ledger reconciliation.',

  contactEmail: 'secretariat@iconicawardsafrica.com',
  contactPhone: '+234 (0) 1 888 4220 / +234 (0) 803 999 IAA1',
  contactAddress: 'IAA Secretariat, Penthouse Floor, Landmark Towers, Water Corporation Road, Victoria Island, Lagos, Nigeria',

  socialLinks: {
    instagram: 'https://instagram.com/iconicawardsafrica',
    twitter: 'https://x.com/iaafricaofficial',
    facebook: 'https://facebook.com/iconicawardsafrica',
    tiktok: 'https://tiktok.com/@iconicawardsafrica',
    youtube: 'https://youtube.com/@iconicawardsafrica',
    whatsapp: 'https://wa.me/2348039994221'
  },

  paystackPublicKey: 'pk_live_iaa_7th_edition_prod_sample',
  paystackSecretKey: '••••••••••••••••••••••••••••••••',
  flutterwavePublicKey: 'FLWPUBK-iaa-7th-sample',
  flutterwaveSecretKey: '••••••••••••••••••••••••••••••••',
  emailSenderName: 'Iconic Awards Africa Secretariat',
  emailSenderAddress: 'ballot-receipts@iconicawardsafrica.com',

  seo: {
    metaTitle: 'Iconic Awards Africa (IAA) | The Continental Crown of African Culture & Haute Couture',
    metaDescription: 'Official voting platform and gala portal for Iconic Awards Africa (IAA) 7th Edition. Celebrate and vote for visionary African fashion designers, cultural icons, music ambassadors, and cinematic trailblazers.',
    metaKeywords: 'Iconic Awards Africa, IAA 2026, African Cultural Fashion, Haute Couture Africa, African Designers, Aso-Oke, Kente, Nollywood Awards, Afrobeats Awards, African Culture Honors, Verified Voting',
    canonicalUrl: 'https://iconicawardsafrica.com',
    ogTitle: 'Iconic Awards Africa (IAA) | The Continental Crown of African Culture & Haute Couture',
    ogDescription: 'Honoring exceptional African creative brilliance across haute couture, music, cinema, and cultural arts. Cast verified votes in NGN and USD.',
    ogImageUrl: '/iaa-logo.svg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@IconicAwardsAfr',
    twitterCreator: '@IconicAwardsAfr',
    robotsDirective: 'index, follow',
    enableJsonLd: true,
    schemaType: 'Event',
    organizationName: 'Iconic Awards Africa Secretariat',
    eventName: 'Iconic Awards Africa (7th Edition) - The Cultural Fashion Gala',
    eventStartDate: '2026-11-28T18:00:00+01:00',
    eventEndDate: '2026-11-29T02:00:00+01:00',
    eventLocationName: 'The Grand Continental Ballroom, Landmark Centre',
    eventLocationAddress: 'Water Corporation Drive, Victoria Island, Lagos, Nigeria',
    googleSiteVerification: '',
    bingSiteVerification: '',
    googleAnalyticsId: ''
  }
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-super-1',
    name: 'Adewale Adeleke',
    email: 'admin@iconicawardsafrica.com',
    role: 'super_admin',
    createdAt: '2026-01-10T09:00:00Z',
    lastLogin: '2026-09-24T05:30:00Z'
  },
  {
    id: 'user-staff-2',
    name: 'Ngozi Okonjo-Clark',
    email: 'staff@iconicawardsafrica.com',
    role: 'staff',
    createdAt: '2026-03-15T10:30:00Z',
    lastLogin: '2026-09-23T18:40:00Z'
  },
  {
    id: 'user-audit-3',
    name: 'Kofi Mensah',
    email: 'auditor@iconicawardsafrica.com',
    role: 'viewer',
    createdAt: '2026-05-01T14:15:00Z',
    lastLogin: '2026-09-22T11:20:00Z'
  }
];
