import type { RorschachResponse } from '@/types';

/**
 * Score-only transcription of the 20-response Comprehensive System case in
 * Engelman et al. (2016). The article publishes both the Sequence of Scores
 * and the completed Structural Summary. Verbatim responses and identifying
 * clinical material are intentionally excluded.
 *
 * Source: https://www.therapeuticassessment.com/docs/Engelman_et_al_2016_copy.pdf
 * Expected Structural Summary: Table 1 (PDF page 7)
 * Sequence of Scores: Table 2 (PDF page 8)
 */
export const PUBLISHED_PIPPA_CASE: RorschachResponse[] = [
  { card: 'I', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'I', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: '-', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: ['MOR'] },
  { card: 'II', response: '', location: 'W', dq: '+', determinants: ['FMa'], fq: 'o', pair: '(2)', contents: ['A', 'Cg'], popular: true, z: 'ZW', specialScores: ['FABCOM1'] },
  { card: 'II', response: '', location: 'D', dq: '+', determinants: ['FMp', 'FC'], fq: '-', pair: '(2)', contents: ['A'], popular: false, z: 'ZA', specialScores: ['MOR', 'DV1'] },
  { card: 'III', response: '', location: 'D', dq: '+', determinants: ['Ma'], fq: 'o', pair: '(2)', contents: ['H', 'Cg', 'Hh'], popular: true, z: 'ZA', specialScores: ['COP'] },
  { card: 'III', response: '', location: 'D', dq: '+', determinants: ['FC'], fq: 'o', pair: '(2)', contents: ['H', 'Cg'], popular: true, z: 'ZA', specialScores: [] },
  { card: 'IV', response: '', location: 'W', dq: 'o', determinants: ['FV'], fq: 'o', pair: 'none', contents: ['Ad', 'Hh'], popular: false, z: 'ZW', specialScores: ['MOR'] },
  { card: 'IV', response: '', location: 'W', dq: 'v', determinants: ["C'F"], fq: 'u', pair: 'none', contents: ['Bt'], popular: false, z: '', specialScores: ['PER', 'DR1'] },
  { card: 'V', response: '', location: 'W', dq: 'o', determinants: ['FMp'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: 'ZW', specialScores: ['DR1'] },
  { card: 'V', response: '', location: 'W', dq: '+', determinants: ['FMa'], fq: '-', pair: 'none', contents: ['A', 'An', 'Id'], popular: false, z: 'ZA', specialScores: ['DR1', 'DV1', 'INCOM1', 'MOR'] },
  { card: 'VI', response: '', location: 'W', dq: '+', determinants: ['mp'], fq: 'u', pair: 'none', contents: ['H', 'Cg', 'Ad', 'Art'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'VI', response: '', location: 'D', dq: 'o', determinants: ['F'], fq: '-', pair: 'none', contents: ['An'], popular: false, z: '', specialScores: ['PER'] },
  { card: 'VII', response: '', location: 'W', dq: '+', determinants: ['Ma', 'mp', 'FY'], fq: 'o', pair: '(2)', contents: ['H', 'Sx'], popular: true, z: 'ZW', specialScores: ['COP'] },
  { card: 'VII', response: '', location: 'W', dq: 'o', determinants: ['FY'], fq: 'o', pair: '(2)', contents: ['Hd', 'Id'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'VIII', response: '', location: 'D', dq: '+', determinants: ['FC', 'FMa'], fq: 'u', pair: '(2)', contents: ['A', 'Bt'], popular: false, z: 'ZA', specialScores: ['INCOM1'] },
  { card: 'VIII', response: '', location: 'D', dq: '+', determinants: ['YF', 'mp', 'CF', 'FD'], fq: 'u', pair: '(2)', contents: ['Na', 'A'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'IX', response: '', location: 'WS', dq: '+', determinants: ['FC'], fq: 'u', pair: 'none', contents: ['(Hd)', 'Cg'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'IX', response: '', location: 'WS', dq: 'o', determinants: ['FC'], fq: 'u', pair: 'none', contents: ['(Hd)'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'X', response: '', location: 'D', dq: '+', determinants: ['FC', "FC'", 'Ma'], fq: 'o', pair: '(2)', contents: ['A', 'Cg'], popular: true, z: 'ZA', specialScores: ['FABCOM1', 'INCOM1'] },
  { card: 'X', response: '', location: 'DdS', dq: '+', determinants: ['FC', "FC'"], fq: '-', pair: 'none', contents: ['Art', '(Hd)', 'Cg'], popular: false, z: 'ZA', specialScores: [] },
];
