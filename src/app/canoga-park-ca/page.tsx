import type { Metadata } from 'next';
import HomeView from '../../views/HomeView';

export const metadata: Metadata = {
  title: 'Luxury Jeweleris — Fine Jewelry & Custom Engagement Rings in Canoga Park, CA',
  description: 'Shop luxury handcrafted engagement rings, GIA diamonds, and fine gold jewelry at Luxury Jeweleris in Canoga Park, CA.',
};

export default function CanogaParkCAPage() {
  return <HomeView />;
}
