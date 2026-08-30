import type { Metadata } from 'next';
import { ProfileDashboard } from '@/components/account/ProfileDashboard';

export const metadata: Metadata = {
  title: 'Order Archive & Dispatch Status | Otaru',
  description: 'Track and review past garment purchases and Shiprocket dispatch statuses.',
};

export default function OrdersPage() {
  return <ProfileDashboard />;
}
