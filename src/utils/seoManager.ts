import { SeoSettings, SiteContent, Edition, Event, Category, Nominee } from '../types';

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
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
};

/**
 * Generates Schema.org JSON-LD structured data based on SEO configurations
 */
export function generateSchemaJsonLd(
  seo: SeoSettings,
  siteContent: SiteContent,
  edition?: Edition,
  events?: Event[]
): Record<string, any> {
  const primaryEvent = events?.find(e => e.status === 'upcoming' || e.status === 'live') || events?.[0];

  if (seo.schemaType === 'Event') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Festival',
      name: seo.eventName || 'Iconic Awards Africa (7th Edition)',
      description: seo.metaDescription || siteContent.tagline,
      startDate: seo.eventStartDate || primaryEvent?.date || '2026-11-28T18:00:00+01:00',
      endDate: seo.eventEndDate || '2026-11-29T02:00:00+01:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: seo.eventLocationName || primaryEvent?.venue || 'Landmark Centre Grand Ballroom',
        address: {
          '@type': 'PostalAddress',
          streetAddress: seo.eventLocationAddress || 'Water Corporation Drive, Victoria Island',
          addressLocality: 'Lagos',
          addressRegion: 'Lagos State',
          addressCountry: 'NG'
        }
      },
      image: [
        seo.ogImageUrl || siteContent.logoUrl || 'https://iconicawardsafrica.com/iaa-logo.svg'
      ],
      organizer: {
        '@type': 'Organization',
        name: seo.organizationName || siteContent.brandName || 'Iconic Awards Africa',
        url: seo.canonicalUrl || 'https://iconicawardsafrica.com',
        logo: siteContent.logoUrl || '/iaa-logo.svg',
        sameAs: [
          siteContent.socialLinks?.instagram || 'https://instagram.com/iconicawardsafrica',
          siteContent.socialLinks?.twitter || 'https://x.com/iaafricaofficial',
          siteContent.socialLinks?.facebook || 'https://facebook.com/iconicawardsafrica'
        ].filter(Boolean)
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'NGN',
        lowPrice: '35000',
        highPrice: '500000',
        offerCount: '4',
        url: `${seo.canonicalUrl || 'https://iconicawardsafrica.com'}/tickets`,
        availability: 'https://schema.org/InStock',
        validFrom: '2026-08-01T00:00:00Z'
      }
    };
  }

  if (seo.schemaType === 'Organization') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: seo.organizationName || siteContent.brandName || 'Iconic Awards Africa',
      legalName: 'Iconic Awards Africa Foundation & Secretariat',
      url: seo.canonicalUrl || 'https://iconicawardsafrica.com',
      logo: siteContent.logoUrl || '/iaa-logo.svg',
      description: siteContent.aboutStory || seo.metaDescription,
      foundingDate: '2020',
      founders: [
        {
          '@type': 'Person',
          name: 'IAA Board of Cultural Governors'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteContent.contactAddress || 'Landmark Towers, Water Corporation Road',
        addressLocality: 'Lagos',
        addressCountry: 'NG'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: siteContent.contactPhone || '+2348039994220',
        contactType: 'Customer Support & Secretariat',
        email: siteContent.contactEmail || 'secretariat@iconicawardsafrica.com',
        availableLanguage: ['English', 'French', 'Yoruba', 'Igbo', 'Hausa', 'Swahili']
      },
      sameAs: [
        siteContent.socialLinks?.instagram,
        siteContent.socialLinks?.twitter,
        siteContent.socialLinks?.facebook,
        siteContent.socialLinks?.youtube
      ].filter(Boolean)
    };
  }

  if (seo.schemaType === 'WebApplication') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: siteContent.brandName || 'Iconic Awards Africa Voting Portal',
      url: seo.canonicalUrl || 'https://iconicawardsafrica.com',
      applicationCategory: 'EntertainmentApplication',
      operatingSystem: 'All Modern Web Browsers (iOS, Android, Windows, macOS)',
      description: seo.metaDescription,
      offers: {
        '@type': 'Offer',
        price: '100',
        priceCurrency: 'NGN'
      }
    };
  }

  // Custom fallback
  if (seo.customJsonLd) {
    try {
      return JSON.parse(seo.customJsonLd);
    } catch {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteContent.brandName,
        url: seo.canonicalUrl
      };
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteContent.brandName,
    url: seo.canonicalUrl
  };
}

/**
 * Updates DOM head elements with configured SEO parameters in real-time
 */
export function applySeoToDOM(
  seo: SeoSettings,
  siteContent: SiteContent,
  edition?: Edition,
  events?: Event[]
) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  const pageTitle = seo.metaTitle?.trim() || `${siteContent.brandName} | ${siteContent.tagline}`;
  document.title = pageTitle;

  // Helper to get or create a meta tag
  const setMeta = (name: string, content: string, isProperty = false) => {
    if (!content) return;
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to set link tags
  const setLink = (rel: string, href: string) => {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // 2. Standard Search Meta
  setMeta('description', seo.metaDescription || siteContent.heroSubheading);
  setMeta('keywords', seo.metaKeywords);
  setMeta('robots', seo.robotsDirective || 'index, follow');
  setLink('canonical', seo.canonicalUrl || window.location.origin);

  // 3. OpenGraph Social Cards
  setMeta('og:title', seo.ogTitle || pageTitle, true);
  setMeta('og:description', seo.ogDescription || seo.metaDescription, true);
  setMeta('og:image', seo.ogImageUrl || siteContent.logoUrl || '/iaa-logo.svg', true);
  setMeta('og:url', seo.canonicalUrl || window.location.href, true);
  setMeta('og:type', seo.ogType || 'website', true);
  setMeta('og:site_name', siteContent.brandName || 'Iconic Awards Africa', true);

  // 4. Twitter / X Cards
  setMeta('twitter:card', seo.twitterCard || 'summary_large_image');
  setMeta('twitter:title', seo.ogTitle || pageTitle);
  setMeta('twitter:description', seo.ogDescription || seo.metaDescription);
  setMeta('twitter:image', seo.ogImageUrl || siteContent.logoUrl || '/iaa-logo.svg');
  if (seo.twitterSite) setMeta('twitter:site', seo.twitterSite);
  if (seo.twitterCreator) setMeta('twitter:creator', seo.twitterCreator);

  // 5. Search Engine Webmaster Verifications
  if (seo.googleSiteVerification) {
    setMeta('google-site-verification', seo.googleSiteVerification);
  }
  if (seo.bingSiteVerification) {
    setMeta('msvalidate.01', seo.bingSiteVerification);
  }

  // 6. Schema.org JSON-LD Injection
  const scriptId = 'iaa-schema-jsonld-dynamic';
  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement;
  if (seo.enableJsonLd !== false) {
    const jsonLdData = generateSchemaJsonLd(seo, siteContent, edition, events);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLdData, null, 2);
  } else if (scriptEl) {
    scriptEl.remove();
  }
}

/**
 * Generate XML Sitemap
 */
export function generateSitemapXml(
  baseUrl: string = 'https://iconicawardsafrica.com',
  categories: Category[] = [],
  nominees: Nominee[] = []
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const coreRoutes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/categories', priority: '0.9', changefreq: 'daily' },
    { path: '/nominees', priority: '0.9', changefreq: 'daily' },
    { path: '/leaderboard', priority: '0.9', changefreq: 'always' },
    { path: '/tickets', priority: '0.8', changefreq: 'daily' },
    { path: '/events', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/past-editions', priority: '0.7', changefreq: 'monthly' },
    { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
    { path: '/sponsors', priority: '0.6', changefreq: 'monthly' },
    { path: '/faq-contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/legal', priority: '0.5', changefreq: 'yearly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  coreRoutes.forEach(r => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}${r.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
    xml += `    <priority>${r.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(
  baseUrl: string = 'https://iconicawardsafrica.com',
  directive: string = 'index, follow'
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const disallowAll = directive.includes('noindex');

  let content = `# =========================================\n`;
  content += `# robots.txt for Iconic Awards Africa (IAA)\n`;
  content += `# =========================================\n\n`;
  content += `User-agent: *\n`;

  if (disallowAll) {
    content += `Disallow: /\n`;
  } else {
    content += `Allow: /\n`;
    content += `Disallow: /admin\n`;
    content += `Disallow: /api/\n`;
  }

  content += `\nSitemap: ${cleanBase}/sitemap.xml\n`;
  return content;
}
