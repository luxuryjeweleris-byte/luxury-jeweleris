import type { Metadata } from 'next';
import HomeView from '../views/HomeView';

export const metadata: Metadata = {
  title: 'Luxury Jeweleris',
  description: 'Exquisite Handcrafted Fine Jewelry, Custom Diamond Engagement Rings, and Ethically Sourced Gemstones.',
};

export default function Home() {
  return <HomeView />;
}
