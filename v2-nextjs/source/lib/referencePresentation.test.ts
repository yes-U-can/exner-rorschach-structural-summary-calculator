import { describe, expect, it } from 'vitest';
import {
  getReferencePresentationCategory,
  getReferencePresentationTitle,
} from './referencePresentation';

describe('reference presentation labels', () => {
  it('uses clinician-facing labels without changing canonical routes', () => {
    expect(
      getReferencePresentationTitle('ko', 'scoring-input/dq', '[부호화/발달질] DQ'),
    ).toBe('발달질(DQ)');
    expect(
      getReferencePresentationTitle('ja', 'scoring-input/fq', '[符号化/形態質] FQ'),
    ).toBe('形態水準(FQ)');
    expect(
      getReferencePresentationTitle('es', 'scoring-input/card', '[Codificación] Card'),
    ).toBe('Lámina');
  });

  it('strips technical category prefixes from entry titles', () => {
    expect(
      getReferencePresentationTitle(
        'en',
        'result-interpretation/lower-section/affect/FC_CF_C',
        '[Interpretation/Affect] FC:CF+C',
      ),
    ).toBe('FC:CF+C');
  });

  it('provides localized context labels for disconnected search results', () => {
    expect(
      getReferencePresentationCategory(
        'pt',
        'result-interpretation/lower-section/interpersonal/PureH',
      ),
    ).toBe('Relações Interpessoais');
  });
});
