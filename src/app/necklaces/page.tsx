import type { Metadata } from 'next';
import NecklacesClient from './NecklacesClient';

export const metadata: Metadata = {
  title: 'Fine Gold & Diamond Necklaces, Pendants | Luxury Jeweleris',
  description: 'Explore solid gold chain necklaces, diamond solitaire pendants, and handcrafted gemstone jewelry.',
};

export default function NecklacesPage() {
  return <NecklacesClient />;
}
