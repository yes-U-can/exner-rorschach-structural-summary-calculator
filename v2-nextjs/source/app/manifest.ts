import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Computing Program for Rorschach Structural Summary',
    short_name: 'Rorschach SS',
    description:
      'Free online Rorschach Comprehensive System structural summary calculator for clinical practice and training.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F7F9FB',
    theme_color: '#4E73AA',
    lang: 'ko',
    dir: 'ltr',
    categories: ['education', 'medical', 'productivity'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/sicp-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/sicp-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
