'use client';

import React, { useState } from 'react';
import { DoorButton } from '../ui/DoorButton';

export function ResidentsSection() {
  const [formData, setFormData] = useState({
    email: '',
    igHandle: '',
    city: '',
    interests: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.email) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success && data.resident?.number) {
        // Redirect to share page
        window.location.href = `/residents/${data.resident.number}`;
      } else {
        alert(data.error || 'Failed to join waitlist. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative section-pad bg-paper-2 border-y border-hairline" id="residents">
      <div className="wrap">
        <div className="grid-otaru">
          
          <div className="col-span-full md:col-span-5 mb-12 md:mb-0">
            <h2 className="caption text-madder mb-4">THE RESIDENCY</h2>
            <p className="font-display text-4xl mb-6">Leave the door open.</p>
            
            <ul className="space-y-4 mb-8 text-ink/70">
              <li className="flex items-start gap-3">
                <span className="text-madder">◇</span>
                <span>Early access to all future drops</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-madder">◇</span>
                <span>Private studio notes and sourcing diaries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-madder">◇</span>
                <span>An allocated Resident Number</span>
              </li>
            </ul>
            
            <p className="caption text-ink/40">
              We process applications manually. Access is not guaranteed.
            </p>
          </div>

          <div className="col-span-full md:col-span-6 md:col-start-7">
            <form onSubmit={handleSubmit} className="bg-paper border border-hairline p-6 md:p-10 shadow-sm">
              <h3 className="font-mono tracking-widest text-sm mb-8 uppercase text-ink/50">Waitlist Application</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block caption mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    className="w-full bg-transparent border-b border-hairline pb-2 focus:border-indigo outline-none transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ig" className="block caption mb-2">Instagram (Optional)</label>
                    <input 
                      type="text" 
                      id="ig" 
                      className="w-full bg-transparent border-b border-hairline pb-2 focus:border-indigo outline-none transition-colors"
                      value={formData.igHandle}
                      onChange={(e) => setFormData({...formData, igHandle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block caption mb-2">City (Optional)</label>
                    <input 
                      type="text" 
                      id="city" 
                      className="w-full bg-transparent border-b border-hairline pb-2 focus:border-indigo outline-none transition-colors"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-hairline">
                  <p className="caption text-[10px] text-ink/40 mb-6 leading-relaxed">
                    By entering, you consent to receive communications from House of Otaru in accordance with our Privacy Policy. Your data will never be sold.
                  </p>
                  
                  <div className="flex justify-end">
                    <DoorButton 
                      isSubmitting={isSubmitting} 
                      onEnter={() => handleSubmit()} 
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
