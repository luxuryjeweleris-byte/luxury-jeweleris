import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import { CartProvider } from '../context/CartContext';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StoreLocations from '../components/StoreLocations';
import Toast from '../components/Toast';
import '../index.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display-outfit',
});

export const metadata: Metadata = {
  title: 'Luxury Jeweleris — Exquisite Handcrafted Fine Jewelry',
  description: 'Shop premium curated engagement rings, wedding bands, and fine jewelry at Luxury Jeweleris. Crafted with ethically sourced gemstones and timeless designs.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 50 50%22><defs><linearGradient id=%22g%22><stop offset=%220%25%22 stop-color=%22%23FCE0AD%22/><stop offset=%22100%25%22 stop-color=%22%238E5E24%22/></linearGradient></defs><polygon points=%2225,2 48,15 25,44 2,15%22 fill=%22none%22 stroke=%22url(%23g)%22 stroke-width=%223%22/><polygon points=%2225,12 40,20 25,38 10,20%22 fill=%22none%22 stroke=%22url(%23g)%22 stroke-width=%222.5%22/><path d=%22M2,46 Q25,41 48,46%22 fill=%22none%22 stroke=%22url(%23g)%22 stroke-width=%222.5%22/></svg>'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: 'Luxury Jeweleris',
  image: 'https://www.luxuryjeweleris.com/logo.png',
  '@id': 'https://www.luxuryjeweleris.com',
  url: 'https://www.luxuryjeweleris.com',
  telephone: '+1-213-642-7217',
  priceRange: '$$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '400 S Baldwin Ave, Suite 231',
    addressLocality: 'Arcadia',
    addressRegion: 'CA',
    postalCode: '91007',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 34.1347,
    longitude: -118.0536,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '20:00',
    },
  ],
  sameAs: [
    'https://www.instagram.com/luxuryjeweleris',
    'https://www.facebook.com/luxuryjeweleris',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QY4KY2FQ82"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QY4KY2FQ82');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <SiteSettingsProvider>
          <CartProvider>
            <div className="app-container">
              <Navbar />
              <Toast />
              <main className="main-content">{children}</main>
              <StoreLocations />
              <Footer />
            </div>
          </CartProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

