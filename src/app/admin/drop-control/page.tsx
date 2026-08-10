import type { Metadata } from 'next';
import { DropControlPlane } from '@/components/admin/drop-control-plane';

export const metadata: Metadata = {
  title: 'Drop Control Plane — Otaru Admin',
  description: 'Real-time drop operations dashboard, stock gauges, and production launch gate controls.',
};

export default function DropControlPage() {
  return <DropControlPlane />;
}
