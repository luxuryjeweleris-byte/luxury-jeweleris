import type { Metadata } from 'next';
import BraceletsClient from './BraceletsClient';

export const metadata: Metadata = {
  title: 'Handcrafted Diamond & Gold Bracelets | Luxury Jeweleris',
  description: 'Shop diamond tennis bracelets, cuff bangles, and delicate gold chain bracelets.',
};

export default function BraceletsPage() {
  return <BraceletsClient />;
}
