import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
  title: 'Luxury Jeweleris — The Smarter Way to Buy Diamonds',
  description: 'Shop certified loose diamonds and engagement rings at Luxury Jeweleris. Compare over 1 million diamonds with AI quality scores and price matching to find the best deal.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 50 50%22><defs><linearGradient id=%22g%22><stop offset=%220%25%22 stop-color=%22%23FCE0AD%22/><stop offset=%22100%25%22 stop-color=%22%238E5E24%22/></linearGradient></defs><polygon points=%2225,2 48,15 25,44 2,15%22 fill=%22none%22 stroke=%22url(%23g)%22 stroke-width=%223%22/><polygon points=%2225,12 40,20 25,38 10,20%22 fill=%22none%22 stroke=%22url(%23g)%22 stroke-width=%222.5%22/><path d=%22M2,46 Q25,41 48,46%22 fill=%22none%22 stroke=%22url(%23g)%22 stroke-width=%222.5%22/></svg>'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            <Toast />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
