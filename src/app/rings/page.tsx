import type { Metadata } from 'next';
import RingsClient from './RingsClient';

export const metadata: Metadata = {
  title: 'Rings — Diamond Rings & Custom Bands | Luxury Jeweleris',
  description: 'Shop custom diamond rings in solitaire, halo, pavé, and three-stone styles with certified natural and lab-grown diamonds.',
};

export default function RingsPage() {
  return <RingsClient />;
}
