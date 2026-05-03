export type ClientShowcaseAccent = 'emerald' | 'sky';

export type ClientShowcaseItem = {
  id: string;
  name: string;
  tagline: string;
  sector: string;
  href: string;
  highlights: string[];
  accent: ClientShowcaseAccent;
};

/** Public launches visitors can explore; additional work often stays private under NDA. */
export const PUBLIC_CLIENT_SHOWCASE: ClientShowcaseItem[] = [
  {
    id: 'mrantidot',
    name: 'Mr Antidot',
    tagline: 'Hygiene management & pest control services',
    sector: 'Services · India',
    href: 'https://www.mrantidot.com/',
    highlights: ['Booking & inspection flows', 'Service catalog', 'Brand-led marketing UI'],
    accent: 'emerald'
  },
  {
    id: 'quadratocargo',
    name: 'Quadrato Cargo',
    tagline: 'International courier, booking & tracking',
    sector: 'Logistics',
    href: 'https://quadratocargo.com/',
    highlights: ['Shipment tracking', 'Quotes & booking', 'Operations-ready UX'],
    accent: 'sky'
  }
];
