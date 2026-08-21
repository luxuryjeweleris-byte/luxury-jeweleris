import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Luxury Jeweleris | Customer Care & Appointments',
  description: 'Get in touch with Luxury Jeweleris experts for custom design inquiries, order support, or private boutique appointments.',
};

export default function ContactPage() {
  return <ContactClient />;
}
