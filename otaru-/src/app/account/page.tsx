import type { Metadata } from 'next';
import { AccountDashboard } from '@/components/account/account-dashboard';

export const metadata: Metadata = {
  title: 'Customer Account & Registry | Otaru',
  description: 'Manage your Otaru Patron membership status, order history, and dispatch addresses.',
};

export default function AccountPage() {
  return (
    <div id="account-page" className="py-12 md:py-20">
      <div className="grid-container max-w-5xl">
        <AccountDashboard />
      </div>
    </div>
  );
}
