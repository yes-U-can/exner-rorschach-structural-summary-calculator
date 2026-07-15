import type { RorschachResponse } from '@/types';

/**
 * Score-only transcription of the 20-response Comprehensive System example
 * published with its RIAP v5 Structural Summary in Gurley (2017), Appendix A.
 * Response wording and identifying case material are intentionally excluded.
 *
 * Source: https://elmirmohammedmemorypsy.com/wp-content/uploads/2021/04/essentials-of-rorschach-assessment.pdf
 * Sequence of Scores: Table A.2 (PDF page 348)
 * Expected Structural Summary: Tables A.4-A.24 (PDF pages 350-359)
 */
export const PUBLISHED_RIAP_CASE: RorschachResponse[] = [
  { card: 'I', response: '', location: 'WS', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: false, z: 'ZS', specialScores: [] },
  { card: 'I', response: '', location: 'W', dq: 'o', determinants: ['FMa'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'II', response: '', location: 'W', dq: 'o', determinants: ['CF', "C'F", 'FMa'], fq: 'u', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'II', response: '', location: 'D', dq: 'o', determinants: ['FD'], fq: '-', pair: 'none', contents: ['An'], popular: false, z: '', specialScores: [] },
  { card: 'II', response: '', location: 'DS', dq: '+', determinants: ['Ma', "FC'"], fq: 'u', pair: 'none', contents: ['Cg', 'H'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'III', response: '', location: 'W', dq: '+', determinants: ['Ma', 'C', 'mp'], fq: 'o', pair: '(2)', contents: ['H', 'Sx', 'Bl', 'Hh'], popular: true, z: 'ZW', specialScores: ['AG', 'MOR'] },
  { card: 'III', response: '', location: 'D', dq: 'o', determinants: ['F'], fq: 'u', pair: 'none', contents: ['H', 'An'], popular: false, z: '', specialScores: ['DV1'] },
  { card: 'IV', response: '', location: 'W', dq: 'o', determinants: ['Ma', 'FY'], fq: 'o', pair: 'none', contents: ['(H)'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'IV', response: '', location: 'W', dq: '+', determinants: ['Ma', 'FD'], fq: 'o', pair: 'none', contents: ['(H)', 'Sc'], popular: true, z: 'ZA', specialScores: [] },
  { card: 'V', response: '', location: 'W', dq: 'o', determinants: ['FMa'], fq: 'o', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'V', response: '', location: 'Dd', dq: 'o', determinants: ['FMa'], fq: 'u', pair: 'none', contents: ['A'], popular: false, z: '', specialScores: [] },
  { card: 'VI', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['Ad', 'Hh', 'Sx'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'VI', response: '', location: 'D', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['Sc'], popular: false, z: '', specialScores: [] },
  { card: 'VII', response: '', location: 'D', dq: 'o', determinants: ['Mp'], fq: 'o', pair: '(2)', contents: ['Hd'], popular: true, z: '', specialScores: [] },
  { card: 'VII', response: '', location: 'DS', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['Hh'], popular: false, z: '', specialScores: [] },
  { card: 'VIII', response: '', location: 'W', dq: '+', determinants: ['FMa', 'rF'], fq: 'o', pair: 'none', contents: ['A', 'Na'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'VIII', response: '', location: 'D', dq: 'o', determinants: ['FC'], fq: 'u', pair: 'none', contents: ['Cg'], popular: false, z: '', specialScores: [] },
  { card: 'IX', response: '', location: 'D', dq: 'v/+', determinants: ['ma-p', 'CF'], fq: 'o', pair: 'none', contents: ['Na'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'X', response: '', location: 'DdS', dq: 'o', determinants: ["FC'", 'FC'], fq: '-', pair: 'none', contents: ['H', 'Sx', 'Cg'], popular: false, z: 'ZS', specialScores: [] },
  { card: 'X', response: '', location: 'D', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: false, z: '', specialScores: ['PER'] },
];
