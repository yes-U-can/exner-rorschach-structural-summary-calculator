import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const layoutSource = readFileSync('app/layout.tsx', 'utf8');
const privacySource = readFileSync('app/privacy/page.tsx', 'utf8');
const packageManifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
  dependencies?: Record<string, string>;
};

describe('visitor analytics privacy boundary', () => {
  it('uses only Vercel Web Analytics in the application layout', () => {
    expect(packageManifest.dependencies?.['@vercel/analytics']).toBe('2.0.1');
    expect(layoutSource).toContain("import { Analytics } from '@vercel/analytics/next'");
    expect(layoutSource).toContain('<Analytics />');

    expect(layoutSource).not.toContain('GoogleAnalyticsPageView');
    expect(layoutSource).not.toContain('googletagmanager.com');
    expect(layoutSource).not.toContain('NEXT_PUBLIC_GA_MEASUREMENT_ID');
    expect(layoutSource).not.toContain('NEXT_PUBLIC_COOKIEYES_SCRIPT_URL');
  });

  it('discloses anonymous visitor statistics in every supported language', () => {
    for (const heading of [
      '익명 방문 통계',
      'Anonymous visitor statistics',
      '匿名の訪問統計',
      'Estadísticas anónimas de visitas',
      'Estatísticas anônimas de visitas',
    ]) {
      expect(privacySource).toContain(heading);
    }

    expect(privacySource).toContain(
      '구조요약 입력값, 계산 결과, AI 대화 내용 및 API 키는 방문 통계에 포함되지 않습니다.',
    );
    expect(privacySource).toContain('Effective Date: September 1, 2026');
  });
});
