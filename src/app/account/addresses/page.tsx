import type { Metadata } from 'next';
import { ProfileDashboard } from '@/components/account/ProfileDashboard';

export const metadata: Metadata = {
  title: 'Dispatch Destinations | Otaru',
  description: 'Manage saved shipping and atelier delivery destinations.',
};

export default function AddressesPage() {
  return <ProfileDashboard />;
}
