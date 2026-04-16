// Next.js 14 App Router PWA manifest route
export const runtime = 'edge';

export function GET() {
  return Response.json({
    name: 'Limbi Română PWA',
    short_name: 'Limbi',
    description: 'Учи румынский с грамматикой и квизом',
    theme_color: '#3b82f6',
    background_color: '#0f172a',
    display: 'standalone',
    start_url: '/',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  });
}
