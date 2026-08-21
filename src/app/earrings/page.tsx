import type { Metadata } from 'next';
import EarringsClient from './EarringsClient';

export const metadata: Metadata = {
  title: 'Diamond & Gold Earrings, Studs & Hoops | Luxury Jeweleris',
  description: 'Shop elegant diamond stud earrings, gold hoops, and gemstone drops handcrafted with ethical metals.',
};

export default function EarringsPage() {
  return <EarringsClient />;
}
