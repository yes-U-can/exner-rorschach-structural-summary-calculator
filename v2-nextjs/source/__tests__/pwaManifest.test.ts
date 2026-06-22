import { existsSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

import manifest from '@/app/manifest';

describe('PWA manifest', () => {
  it('defines the install metadata without related native-app prompts', () => {
    const appManifest = manifest();

    expect(appManifest.name).toBe('Computing Program for Rorschach Structural Summary');
    expect(appManifest.short_name).toBe('Rorschach SS');
    expect(appManifest.start_url).toBe('/');
    expect(appManifest.scope).toBe('/');
    expect(appManifest.display).toBe('standalone');
    expect(appManifest.prefer_related_applications).toBe(false);
    expect(appManifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: '/sicp-icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        }),
        expect.objectContaining({
          src: '/sicp-icon.png',
          sizes: '512x512',
          type: 'image/png',
        }),
      ]),
    );
  });

  it('keeps v2.0.4 install support manifest-only without an offline service worker', () => {
    const serviceWorkerCandidates = [
      join(process.cwd(), 'public', 'sw.js'),
      join(process.cwd(), 'public', 'service-worker.js'),
      join(process.cwd(), 'app', 'sw.ts'),
      join(process.cwd(), 'app', 'service-worker.ts'),
    ];

    expect(serviceWorkerCandidates.some((candidate) => existsSync(candidate))).toBe(false);
  });
});
