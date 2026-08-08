export interface StoreService {
  title: string;
  description: string;
  iconName: string;
}

export interface StoreFAQ {
  question: string;
  answer: string;
}

export interface StoreReview {
  author: string;
  rating: number;
  date: string;
  comment: string;
  source: string;
}

export interface StoreLocationData {
  slug: string;
  id: string;
  name: string;
  shortName: string;
  locationTag: string;
  seoTitle: string;
  metaDescription: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: string;
  email: string;
  hoursString: string;
  openingHours: {
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  geo: {
    latitude: number;
    longitude: number;
  };
  mapUrl: string;
  mapEmbedUrl: string;
  images: string[];
  features: string[];
  services: StoreService[];
  faqs: StoreFAQ[];
  reviews: StoreReview[];
}

export const STORE_LOCATIONS: StoreLocationData[] = [
  {
    slug: 'arcadia-ca',
    id: 'arcadia',
    name: 'Luxury Jewelers - Santa Anita Mall, Arcadia',
    shortName: 'Arcadia Boutique',
    locationTag: 'Santa Anita Mall · Arcadia, CA',
    seoTitle: 'Luxury Jewelry Store in Arcadia, CA | Engagement Rings & Diamonds',
    metaDescription: 'Visit Luxury Jewelers at The Shops at Santa Anita in Arcadia, CA (91007). Shop certified lab & natural diamonds, custom engagement rings, 18k gold jewelry & expert repairs.',
    address: {
      street: '400 S Baldwin Ave, Suite 231',
      city: 'Arcadia',
      state: 'CA',
      zip: '91007',
      country: 'United States',
    },
    phone: '+1 (213) 642-7217',
    email: 'arcadia@luxuryjeweleris.com',
    hoursString: 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 7:00 PM',
    openingHours: [
      {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '21:00',
      },
      {
        dayOfWeek: ['Sunday'],
        opens: '11:00',
        closes: '19:00',
      },
    ],
    geo: {
      latitude: 34.1378,
      longitude: -118.0468,
    },
    mapUrl: 'https://www.google.com/maps/search/400+S+Baldwin+Ave+Ste+231,+Arcadia,+CA+91007',
    mapEmbedUrl: 'https://maps.google.com/maps?q=400%20S%20Baldwin%20Ave%20Suite%20231%20Arcadia%20CA%2091007&t=&z=15&ie=UTF8&iwloc=&output=embed',
    images: [
      '/stores/arcadia_1.jpg',
      '/stores/arcadia_2.jpg',
      '/stores/arcadia_3.jpg',
    ],
    features: [
      'GIA & IGI Certified Gemologists On-Site',
      'Private Custom Ring Consultation Suite',
      'Same-Day Ring Resizing & Polishing',
      'Wheelchair Accessible Boutique',
      'Complimentary Insured Parking',
    ],
    services: [
      {
        title: 'Custom Engagement Ring Design',
        description: 'Work 1-on-1 with master jewelers to craft a bespoke engagement ring with 3D CAD previews and hand-selected loose diamonds.',
        iconName: 'Sparkles',
      },
      {
        title: 'Diamond & Gemstone Consultations',
        description: 'Compare GIA & IGI certified natural and lab-grown diamonds under 10x magnification with certified diamond experts.',
        iconName: 'Gem',
      },
      {
        title: 'Precision Jewelry Repair & Restoration',
        description: 'Expert laser welding, stone tightening, prong rebuilding, and vintage jewelry restoration completed right in our workshop.',
        iconName: 'Wrench',
      },
      {
        title: 'Ring Sizing & Professional Cleaning',
        description: 'Complimentary ultrasonic cleaning and quick ring resizing service for perfect fit and brilliant shine.',
        iconName: 'ShieldCheck',
      },
    ],
    faqs: [
      {
        question: 'Where is Luxury Jewelers located inside Santa Anita Mall in Arcadia?',
        answer: 'We are located on the 2nd level near Nordstorm at 400 S Baldwin Ave, Suite 231, Arcadia, CA 91007. Ample parking is available in the West Garage.',
      },
      {
        question: 'Do I need an appointment to view engagement rings in Arcadia?',
        answer: 'Walk-ins are always welcome! However, booking a private consultation ensures a dedicated certified gemologist will have loose diamonds and custom settings prepped for your visit.',
      },
      {
        question: 'Does the Arcadia store offer same-day ring sizing and jewelry repairs?',
        answer: 'Yes! Simple ring resizings, prong inspections, and ultrasonic cleanings can often be completed on the same day by our on-site master jeweler.',
      },
      {
        question: 'Are lab-grown diamonds available at the Arcadia boutique?',
        answer: 'Absolutely. We carry an extensive inventory of certified lab-grown diamonds and ethically sourced natural diamonds in all shapes and sizes.',
      },
    ],
    reviews: [
      {
        author: 'Elena Rostova',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Found the exact cushion cut halo engagement ring I dreamed of! The Arcadia team was incredibly knowledgeable and zero pressure.',
        source: 'Google Review',
      },
      {
        author: 'Michael Vance',
        rating: 5,
        date: '1 month ago',
        comment: 'Outstanding custom design service. They created a custom wedding band matching my wife’s vintage ring perfectly.',
        source: 'Yelp',
      },
    ],
  },
  {
    slug: 'canoga-park-ca',
    id: 'canoga-park',
    name: 'Luxury Jewelers - Topanga Mall, Canoga Park',
    shortName: 'Canoga Park Boutique',
    locationTag: 'Topanga Mall · Canoga Park, CA',
    seoTitle: 'Luxury Jewelry Store in Canoga Park, CA | Custom Diamonds & Bands',
    metaDescription: 'Visit Luxury Jewelers at Westfield Topanga in Canoga Park, CA (91303). Discover luxury engagement rings, fine diamond jewelry, custom design, and watch services.',
    address: {
      street: '6600 Topanga Canyon Blvd',
      city: 'Canoga Park',
      state: 'CA',
      zip: '91303',
      country: 'United States',
    },
    phone: '+1 (213) 642-7217',
    email: 'topanga@luxuryjeweleris.com',
    hoursString: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: 11:00 AM - 6:00 PM',
    openingHours: [
      {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:00',
      },
      {
        dayOfWeek: ['Sunday'],
        opens: '11:00',
        closes: '18:00',
      },
    ],
    geo: {
      latitude: 34.1906,
      longitude: -118.6058,
    },
    mapUrl: 'https://www.google.com/maps/search/6600+Topanga+Canyon+Blvd,+Canoga+Park,+CA+91303',
    mapEmbedUrl: 'https://maps.google.com/maps?q=6600%20Topanga%20Canyon%20Blvd%20Canoga%20Park%20CA%2091303&t=&z=15&ie=UTF8&iwloc=&output=embed',
    images: [
      '/stores/topanga_1.jpg',
      '/stores/topanga_3.jpg',
    ],
    features: [
      'Westfield Topanga Luxury Wing Access',
      'Personal Bridal Jewelry Stylist',
      'On-Site Diamond Trade-In & Appraisals',
      'Express Cleaning & Polishing Bar',
      'Valet & Structure Parking Available',
    ],
    services: [
      {
        title: 'Bridal & Wedding Band Styling',
        description: 'Explore matching women’s eternity bands, contoured rings, and men’s platinum, gold, and tantalum wedding bands.',
        iconName: 'Heart',
      },
      {
        title: 'Custom Jewelry & Ring Styling',
        description: 'Collaborate with our San Fernando Valley master designers to bring your custom ring concept into reality.',
        iconName: 'Sparkles',
      },
      {
        title: 'Jewelry Appraisal & Insurance Verification',
        description: 'Receive detailed formal insurance appraisals performed by certified graduate gemologists.',
        iconName: 'FileText',
      },
      {
        title: 'Professional Ring Maintenance & Care',
        description: 'Keep your fine jewelry sparkling with deep ultrasonic cleaning, rhodium re-plating, and gemstone safety audits.',
        iconName: 'ShieldCheck',
      },
    ],
    faqs: [
      {
        question: 'Where inside Westfield Topanga is Luxury Jewelers located?',
        answer: 'Our boutique is located at 6600 Topanga Canyon Blvd, Canoga Park, CA 91303 on the main level near Neiman Marcus.',
      },
      {
        question: 'Can I trade in or upgrade my existing diamond ring in Canoga Park?',
        answer: 'Yes! We offer competitive trade-in values and diamond upgrade programs for natural and lab-grown center stones.',
      },
      {
        question: 'What fine jewelry collections are available at Topanga Mall?',
        answer: 'Our Topanga boutique features engagement rings, wedding bands, GIA loose diamonds, tennis bracelets, diamond pendant necklaces, and fine earrings.',
      },
      {
        question: 'How do I book an appointment for custom ring design in Canoga Park?',
        answer: 'You can easily reserve a 1-on-1 VIP appointment using our online booking tool on this page or by calling +1 (213) 642-7217.',
      },
    ],
    reviews: [
      {
        author: 'David & Sarah K.',
        rating: 5,
        date: '3 weeks ago',
        comment: 'Top-tier service at Topanga Mall! They helped us pick out both of our wedding bands in under an hour. Stunning craftsmanship.',
        source: 'Google Review',
      },
      {
        author: 'Amanda Sterling',
        rating: 5,
        date: '2 months ago',
        comment: 'The custom diamond ring service exceeded all expectations. Beautiful store and wonderful personnel.',
        source: 'Yelp',
      },
    ],
  },
];

export function getLocationBySlug(slug: string): StoreLocationData | undefined {
  return STORE_LOCATIONS.find((loc) => loc.slug === slug);
}

export function generateJewelryStoreSchema(location: StoreLocationData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxuryjeweleris.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    '@id': `${siteUrl}/locations/${location.slug}#store`,
    name: location.name,
    alternateName: location.shortName,
    url: `${siteUrl}/locations/${location.slug}`,
    telephone: location.phone,
    email: location.email,
    priceRange: '$$$$',
    image: location.images.map((img) => `${siteUrl}${img}`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address.street,
      addressLocality: location.address.city,
      addressRegion: location.address.state,
      postalCode: location.address.zip,
      addressCountry: location.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.geo.latitude,
      longitude: location.geo.longitude,
    },
    openingHoursSpecification: location.openingHours.map((oh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: oh.dayOfWeek,
      opens: oh.opens,
      closes: oh.closes,
    })),
    hasMap: location.mapUrl,
    sameAs: [
      'https://www.facebook.com/profile.php?id=61588328596938&mibextid=wwXIfr',
    ],
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Apple Pay'],
    currenciesAccepted: 'USD',
  };
}

export function generateFAQPageSchema(faqs: StoreFAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
