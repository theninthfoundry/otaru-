import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getPatronSession } from '@/actions/auth';
import { AccountDashboard } from '@/components/account/account-dashboard';

export const metadata: Metadata = {
  title: 'Customer Account & Registry | Otaru',
  description: 'Manage your Otaru Patron membership status, order history, and dispatch addresses.',
};

export default async function AccountPage() {
  const session = await getPatronSession();

  if (!session) {
    redirect('/account/login');
  }

  return (
    <div id="account-page" className="py-12 md:py-20">
      <div className="grid-container max-w-5xl">
        <AccountDashboard session={session} />
      </div>
    </div>
  );
}
