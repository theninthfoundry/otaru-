// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = any;

export interface SanityImage {
  _type?: string;
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityChapter {
  _id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  status: 'active' | 'archived' | 'upcoming';
  tagline?: string;
  story?: PortableTextBlock[];
  coverImage?: SanityImage;
  symbol?: {
    name: string;
    order: number;
    meaning: string;
    svgMarkup?: string;
  };
  shopifyCollectionHandle?: string;
  productionYear?: number;
  totalProduced?: number;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface SanityJournalEntry {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  coverImage?: SanityImage;
  chapter?: {
    title: string;
    chapterNumber: number;
    slug: string;
  };
  author?: string;
  publishedAt: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface SanityStudioPage {
  headline?: string;
  introduction?: PortableTextBlock[];
  philosophySections?: {
    title: string;
    body: PortableTextBlock[];
    image?: SanityImage;
  }[];
  designPrinciples?: {
    name: string;
    description: string;
  }[];
  symbolLanguage?: PortableTextBlock[];
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface SanitySymbol {
  _id: string;
  name: string;
  order: number;
  meaning?: string;
  svgMarkup?: string;
  image?: SanityImage;
}

export interface SanitySiteSettings {
  siteName?: string;
  siteDescription?: string;
  ogImage?: SanityImage;
  announcement?: {
    enabled: boolean;
    text?: string;
    link?: string;
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  footerText?: string;
  newsletterHeadline?: string;
  newsletterSubtext?: string;
}
