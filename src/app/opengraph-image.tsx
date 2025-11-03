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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#d4c5b0',
        }}
      >
        {/* Logo */}
        <img
          src={logoBase64}
          alt="Mana League Logo"
          width="600"
          height="600"
        />
      </div>
    ),
    {
      ...size,
    }
  );
}

