import type { Metadata } from 'next';
import EngagementRingsClient from './EngagementRingsClient';

export const metadata: Metadata = {
  title: 'Diamond Engagement Rings & Custom Bands | Luxury Jeweleris',
  description: 'Shop custom diamond engagement rings in solitaire, halo, pavé, and three-stone styles with GIA/IGI certified natural and lab-grown diamonds.',
};

export default function EngagementRingsPage() {
  return <EngagementRingsClient />;
}
