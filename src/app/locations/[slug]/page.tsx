import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  STORE_LOCATIONS, 
  getLocationBySlug, 
  generateJewelryStoreSchema, 
  generateFAQPageSchema 
} from '../../../lib/locationsData';
import LocationView from '../../../views/LocationView';

interface LocationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return STORE_LOCATIONS.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    return {
      title: 'Store Location Not Found | Luxury Jeweleris',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxuryjeweleris.com';

  return {
    title: location.seoTitle,
    description: location.metaDescription,
    alternates: {
      canonical: `${siteUrl}/locations/${location.slug}`,
    },
    openGraph: {
      title: location.seoTitle,
      description: location.metaDescription,
      url: `${siteUrl}/locations/${location.slug}`,
      siteName: 'Luxury Jeweleris',
      images: location.images.map((img) => ({
        url: `${siteUrl}${img}`,
        width: 1200,
        height: 630,
        alt: location.name,
      })),
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const storeSchema = generateJewelryStoreSchema(location);
  const faqSchema = generateFAQPageSchema(location.faqs);

  return (
    <>
      {/* Schema.org Structured Data for Local SEO (JewelryStore & FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <LocationView location={location} />
    </>
  );
}
