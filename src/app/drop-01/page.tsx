import React from 'react';
import { DropSection } from '@/components/home/DropSection';
import { Thread } from '@/components/ui/Thread';

export default function Drop01Page() {
  return (
    <>
      <Thread />
      <div className="pt-20">
        <DropSection />
      </div>
    </>
  );
}
