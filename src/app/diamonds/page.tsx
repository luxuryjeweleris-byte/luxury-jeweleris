import type { Metadata } from 'next';
import DiamondsClient from './DiamondsClient';

export const metadata: Metadata = {
  title: 'IGI Certified Lab Grown Diamonds | Luxury Jeweleris',
  description: 'Search certified loose lab grown diamonds by cut, carat, clarity, and color with AI quality analysis and direct pricing.',
};

export default function DiamondsPage() {
  return <DiamondsClient />;
}
