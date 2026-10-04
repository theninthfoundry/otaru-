import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { site } from '../../../../../content/site';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;
  
  // Format the number like "0042"
  const formattedNumber = String(number).padStart(4, '0');
  
  // Get search params for name/city if we wanted dynamic text
  // const searchParams = req.nextUrl.searchParams;
  // const name = searchParams.get('name') || 'Anonymous';
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F4F0E8', // var(--paper)
          padding: '64px',
          border: '12px solid #EBE5D8', // var(--paper-2)
          color: '#151515', // var(--ink)
        }}
      >
        {/* Background texture simulation (dots) */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(21, 21, 21, 0.1) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            opacity: 0.5,
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(21, 21, 21, 0.5)', fontFamily: 'monospace' }}>
              Resident
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(21, 21, 21, 0.5)', fontFamily: 'monospace' }}>
              Entry
            </span>
            <span style={{ fontSize: 64, color: '#A8372C', fontFamily: 'monospace', marginTop: '16px' }}>
              No. {formattedNumber}
            </span>
          </div>
        </div>

        {/* Center / Logo */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', margin: '40px 0' }}>
          <span style={{ fontSize: 120, color: 'rgba(168, 55, 44, 0.8)' }}>
            家
          </span>
        </div>

        {/* Bottom Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', borderTop: '2px solid rgba(21, 21, 21, 0.14)', paddingTop: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 42 }}>{site.name}</span>
            <span style={{ fontSize: 20, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(21, 21, 21, 0.5)', marginTop: '8px', fontFamily: 'monospace' }}>
              Two Harbours
            </span>
          </div>
          
          <div style={{ display: 'flex' }}>
            <span style={{ fontSize: 20, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(21, 21, 21, 0.5)', fontFamily: 'monospace' }}>
              MMXXVI
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
