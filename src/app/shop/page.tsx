import type { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Explore Fine Jewelry, Engagement Rings & Diamonds | Luxury Jeweleris',
  description: 'Browse the full collection of fine jewelry, engagement rings, wedding bands, and certified diamonds at Luxury Jeweleris.',
};

export default function ShopPage() {
  return <ShopClient />;
}
