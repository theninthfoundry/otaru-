'use client';

import React, { useState } from 'react';
import { site } from '../../../content/site';
import { DoorButton } from '../ui/DoorButton';
import { Plate } from '../ui/Plate';

export function HeroSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success && data.resident?.number) {
        window.location.href = `/residents/${data.resident.number}`;
      } else {
        alert(data.error || 'Failed to join waitlist.');
        setIsSubmitting(false);
      }
    } catch (err) {
      alert('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center section-pad pt-32">
      <div className="wrap grid-otaru items-center">
        
        {/* Left: Copy & Action */}
        <div className="col-span-full md:col-span-6 lg:col-span-5 flex flex-col items-start z-10">
          <h1 className="display-xl mb-6">
            {site.description}
          </h1>
          <p className="text-ink/70 mb-12 max-w-[40ch]">
            Japanese craft sensibility, Indian cloth and hands. 
            Numbered. Never restocked.
          </p>
          
          <div className="w-full max-w-md bg-paper-2 p-6 border border-hairline shadow-sm relative">
            <h3 className="caption mb-4 text-ink/50">RESIDENTS WAITLIST</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-paper border border-hairline px-4 py-3 text-sm focus:outline-none focus:border-indigo/30 transition-colors"
                required
              />
              <DoorButton className="sm:w-auto w-full" isSubmitting={isSubmitting} onEnter={handleSubmit} />
            </div>
            <p className="caption text-[10px] text-ink/30 mt-4">
              Drop 01 access is strictly limited.
            </p>
          </div>
        </div>

        {/* Right: Plate / Imagery */}
        <div className="col-span-full md:col-span-6 lg:col-span-6 lg:col-start-7 mt-16 md:mt-0 relative">
          <div className="relative w-full max-w-[500px] ml-auto">
            {/* The Thread will run behind this naturally because of z-index and mix-blend-mode */}
            <Plate 
              ratio="portrait" 
              label="ATELIER STUDY — NO. 01" 
              src="" 
            />
          </div>
        </div>

      </div>
    </section>
  );
}
