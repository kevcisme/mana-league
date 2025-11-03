import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Image metadata
export const alt = 'Mana League - Basketball League';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  // Read logo from file system and convert to base64
  const logoPath = join(process.cwd(), 'public', 'logo.png');
  const logoData = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {/* Logo */}
          <img
            src={logoBase64}
            alt="Mana League Logo"
            width="280"
            height="280"
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.5))',
            }}
          />
          
          {/* Title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              letterSpacing: '-0.02em',
            }}
          >
            MANA LEAGUE
          </div>
          
          {/* Divider */}
          <div
            style={{
              width: '300px',
              height: '4px',
              background: 'linear-gradient(to right, transparent, #8b5cf6, transparent)',
            }}
          />
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: 42,
              fontWeight: '600',
              color: '#e2e8f0',
              textAlign: 'center',
              letterSpacing: '0.1em',
            }}
          >
            ADULT BASKETBALL LEAGUE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

