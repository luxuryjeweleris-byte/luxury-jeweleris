import type { Metadata } from 'next';
import HomeView from '../../views/HomeView';

export const metadata: Metadata = {
  title: 'Luxury Jeweleris — Fine Jewelry & Custom Engagement Rings in Arcadia, CA',
  description: 'Shop luxury handcrafted engagement rings, GIA diamonds, and fine gold jewelry at Luxury Jeweleris in Arcadia, CA.',
};

export default function ArcadiaCAPage() {
  return <HomeView />;
}
