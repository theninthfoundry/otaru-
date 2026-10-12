'use client';

import React, { useState } from 'react';

export interface B2BGstData {
  enabled: boolean;
  gstin: string;
  companyName: string;
  registeredAddress: string;
}

interface CartB2BGstModalProps {
  b2bData: B2BGstData;
  onChange: (data: B2BGstData) => void;
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function CartB2BGstModal({ b2bData, onChange }: CartB2BGstModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [gstinInput, setGstinInput] = useState(b2bData.gstin);
  const [companyInput, setCompanyInput] = useState(b2bData.companyName);
  const [addressInput, setAddressInput] = useState(b2bData.registeredAddress);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGst = gstinInput.trim().toUpperCase();

    if (!GSTIN_REGEX.test(cleanGst)) {
      setErrorMsg('Invalid GSTIN format. Must be 15 alphanumeric characters (e.g. 27AABCO8472M1Z0).');
      return;
    }

    if (!companyInput.trim()) {
      setErrorMsg('Please specify the registered corporate entity name.');
      return;
    }

    onChange({
      enabled: true,
      gstin: cleanGst,
      companyName: companyInput.trim(),
      registeredAddress: addressInput.trim(),
    });

    setErrorMsg(null);
    setIsOpen(false);
  };

  const handleRemove = () => {
    onChange({
      enabled: false,
      gstin: '',
      companyName: '',
      registeredAddress: '',
    });
    setGstinInput('');
    setCompanyInput('');
    setAddressInput('');
    setErrorMsg(null);
  };

  return (
    <div className="border border-hairline bg-[var(--paper-2)]/30 p-4 mt-3 text-xs font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm text-[var(--gold)]">§</span>
          <span className="uppercase tracking-[0.16em] text-[var(--ink)] font-semibold">
            B2B Tax Invoice (Input Tax Credit)
          </span>
        </div>

        {b2bData.enabled ? (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[10px] uppercase tracking-wider text-red-700 hover:underline"
          >
            Remove GSTIN
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-[10px] uppercase tracking-wider text-[var(--indigo)] underline hover:opacity-75"
          >
            + Add Company GSTIN
          </button>
        )}
      </div>

      {b2bData.enabled ? (
        <div className="mt-2.5 p-2.5 bg-emerald-500/5 border border-emerald-900/20 text-emerald-900 text-[11px] leading-relaxed">
          <div className="flex justify-between items-center mb-0.5">
            <strong>{b2bData.companyName}</strong>
            <span className="font-mono text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 tracking-wider">
              VERIFIED ITC
            </span>
          </div>
          <div>GSTIN: {b2bData.gstin}</div>
          {b2bData.registeredAddress && <div className="text-[10px] text-emerald-800/80 truncate">{b2bData.registeredAddress}</div>}
        </div>
      ) : (
        <p className="text-[10px] text-[var(--ink-muted)] mt-1 font-sans">
          Claim 12% Input Tax Credit on apparel acquisitions under your corporate GSTIN.
        </p>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-3.5 sm:p-4 bg-[var(--ink)]/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md max-h-[88vh] overflow-y-auto overscroll-contain bg-[var(--paper)] text-[var(--ink)] border border-[var(--hairline-strong)] p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
              <h3 className="font-display text-lg text-[var(--ink)]">
                Corporate GSTIN Invoice Details
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3 font-sans">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                  15-Digit GSTIN Number *
                </label>
                <input
                  type="text"
                  value={gstinInput}
                  onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                  placeholder="e.g. 27AABCO8472M1Z0"
                  className="w-full px-3 py-2 border border-hairline bg-[var(--paper-2)] font-mono text-xs text-[var(--ink)] uppercase tracking-wider focus:outline-none focus:border-[var(--ink)]"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                  Registered Legal Entity Name *
                </label>
                <input
                  type="text"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  placeholder="e.g. Otaru Design Lab Private Limited"
                  className="w-full px-3 py-2 border border-hairline bg-[var(--paper-2)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                  Registered Tax Address
                </label>
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="e.g. 42 Ballard Estate, Fort, Mumbai 400001"
                  className="w-full px-3 py-2 border border-hairline bg-[var(--paper-2)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
                />
              </div>

              {errorMsg && (
                <p className="font-mono text-[10px] text-red-700">
                  ✕ {errorMsg}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-hairline font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--ink)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--ink)] text-[var(--paper)] font-mono text-[10px] uppercase tracking-wider hover:bg-[var(--indigo)]"
                >
                  Affix to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
