import type { Metadata } from 'next';
import GiftsClient from './GiftsClient';

export const metadata: Metadata = {
  title: 'Luxury Fine Jewelry Gifts for Special Occasions | Luxury Jeweleris',
  description: 'Find unforgettable jewelry gifts for anniversaries, birthdays, and celebrations.',
};

export default function GiftsPage() {
  return <GiftsClient />;
}
