'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NfcScanner() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleNfcScan() {
    setIsScanning(true);
    setStatusMessage('Hold your device near the garment NFC tag...');

    if ('NDEFReader' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        setStatusMessage('Scanning for NFC tag signal...');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
          let readSerial = serialNumber || '';

          for (const record of message.records) {
            if (record.recordType === 'text') {
              const decoder = new TextDecoder(record.encoding);
              readSerial = decoder.decode(record.data);
            }
          }

          if (!readSerial) {
            setStatusMessage('Empty NFC tag payload detected.');
            setIsScanning(false);
            return;
          }

          setStatusMessage(`Verified Tag! Serial: ${readSerial}`);
          setIsScanning(false);
          router.push(`/verify?serial=${encodeURIComponent(readSerial)}`);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ndef.addEventListener('readingerror', () => {
          setStatusMessage('NFC read error. Please hold device close to tag.');
          setIsScanning(false);
        });
      } catch (error) {
        setStatusMessage(`NFC Scanner error: ${(error as Error).message}`);
        setIsScanning(false);
      }
    } else {
      // Production Strict: Unsupported device warning without fake tag simulation
      setStatusMessage('Web NFC is not supported on this device/browser. Please enter the serial number printed on your care label below.');
      setIsScanning(false);
    }
  }

  return (
    <div className="p-6 bg-otaru-ink text-otaru-chalk rounded-sm space-y-4 text-center">
      <div className="space-y-1">
        <span className="text-overline uppercase tracking-widest text-otaru-chalk/60 text-[10px] font-mono">
          Web NFC Direct Scan
        </span>
        <h4 className="text-heading-sm font-semibold text-otaru-chalk">
          Tap Garment NFC Tag
        </h4>
        <p className="text-caption text-otaru-chalk/70 text-xs font-light max-w-sm mx-auto">
          Tap your Android Chrome smartphone directly against the interior leather NFC tag on your Otaru garment.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={handleNfcScan}
          disabled={isScanning}
          className="px-6 py-3 bg-otaru-chalk text-otaru-ink text-caption text-xs font-semibold rounded-full hover:bg-otaru-cream transition-colors disabled:opacity-50"
        >
          {isScanning ? 'Scanning for NFC Signal...' : 'Activate NFC Scanner'}
        </button>
      </div>

      {statusMessage && (
        <p className="text-caption text-xs font-mono text-otaru-chalk/90 animate-pulse">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
