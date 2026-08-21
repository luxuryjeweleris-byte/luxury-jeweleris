import type { Metadata } from 'next';
import WeddingBandsClient from './WeddingBandsClient';

export const metadata: Metadata = {
  title: "Handcrafted Men's & Women's Wedding Bands | Luxury Jeweleris",
  description: 'Explore timeless wedding bands in platinum, 14k/18k yellow, rose & white gold, and diamond-studded eternity bands.',
};

export default function WeddingBandsPage() {
  return <WeddingBandsClient />;
}
