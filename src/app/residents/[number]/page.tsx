import React from 'react';
import { Metadata } from 'next';
import { ResidentCard } from '@/components/ui/ResidentCard';
import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { site } from '../../../../content/site';

interface Props {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  
  return {
    title: `Resident No. ${number} | ${site.name}`,
    description: `I joined the waitlist for ${site.name}. A house between two harbours.`,
    openGraph: {
      images: [
        {
          url: `/api/card/${number}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/api/card/${number}`],
    },
  };
}

export default async function ResidentPage({ params }: Props) {
  const { number } = await params;
  
  // Validate if the number actually exists in DB
  const residentId = parseInt(number, 10);
  if (isNaN(residentId)) {
    notFound();
  }

  const resident = await prisma.resident.findUnique({
    where: { number: residentId }
  });

  if (!resident) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center section-pad">
      <div className="wrap max-w-2xl text-center flex flex-col items-center">
        
        <h1 className="font-display text-4xl mb-4">Welcome to the House.</h1>
        <p className="text-ink/60 mb-12 max-w-md">
          Your allocation number is secured. When Drop 01 opens, Residents will have first access.
        </p>

        <div className="w-full flex justify-center mb-12">
          <ResidentCard 
            number={resident.number} 
            city={resident.city || undefined} 
          />
        </div>

        <div className="space-y-4 w-full max-w-sm">
          {/* Using native Web Share API on client component would be better, 
              but a simple copy-link or standard ahref works for server components.
              We'll use a Client Component for sharing below. */}
          <ShareControls url={`https://otaru.in/residents/${resident.number}`} />
          
          <a href="/" className="block caption text-ink/40 hover:text-madder transition-colors mt-8">
            ← Return to Archive
          </a>
        </div>

      </div>
    </div>
  );
}

// Inline client component for Share API
'use client';
function ShareControls({ url }: { url: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'House of Otaru Resident',
          text: 'I secured my spot on the House of Otaru waitlist.',
          url: url,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="w-full btn-primary"
    >
      {copied ? 'Link Copied!' : 'Share Resident Card'}
    </button>
  );
}
