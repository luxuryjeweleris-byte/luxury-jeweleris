import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Jewelry Insights, Guides & Trends | Luxury Jeweleris Blog',
  description: 'Get expert insights, styling ideas, gemstone guides, and diamond buying advice from Luxury Jeweleris experts.',
};

export default function BlogPage() {
  return <BlogClient />;
}
