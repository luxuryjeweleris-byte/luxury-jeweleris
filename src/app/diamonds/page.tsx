import type { Metadata } from 'next';
import DiamondsClient from './DiamondsClient';

export const metadata: Metadata = {
  title: 'GIA Certified Natural & Lab Grown Diamonds | Luxury Jeweleris',
  description: 'Search certified loose diamonds by cut, carat, clarity, and color with AI quality analysis and direct pricing.',
};

export default function DiamondsPage() {
  return <DiamondsClient />;
}
