import type { RorschachResponse } from '@/types';

/**
 * Score-only transcription of the 21-response Comprehensive System sequence
 * published by Tibon Czopp et al. Verbatim responses and identifying clinical
 * material are intentionally excluded.
 *
 * Article: https://www.researchgate.net/publication/256200451_The_amnestic_syndrome_Applying_the_Rorschach_Inkblot_method_for_differential_diagnosis
 * Corrigendum: https://www.tandfonline.com/doi/pdf/10.1080/13554794.2014.910345
 */
export const PUBLISHED_AMNESTIC_CASE: RorschachResponse[] = [
  { card: 'I', response: '', location: 'WS', dq: '+', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: 'ZS', specialScores: ['DR1'] },
  { card: 'I', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'II', response: '', location: 'DS', dq: 'v/+', determinants: ['mp', "C'", 'VF'], fq: 'u', pair: 'none', contents: ['Na'], popular: false, z: 'ZS', specialScores: ['DR1'] },
  { card: 'II', response: '', location: 'W', dq: 'v/+', determinants: ['mp', 'CF'], fq: '-', pair: 'none', contents: ['A', 'Bl'], popular: false, z: 'ZW', specialScores: ['MOR', 'DV1'] },
  { card: 'III', response: '', location: 'D', dq: '+', determinants: ['Ma'], fq: 'o', pair: '(2)', contents: ['(H)', 'Id'], popular: true, z: 'ZA', specialScores: [] },
  { card: 'III', response: '', location: 'D', dq: '+', determinants: ['Ma'], fq: 'o', pair: '(2)', contents: ['H', 'Cg'], popular: true, z: 'ZA', specialScores: ['AG', 'DR1'] },
  { card: 'IV', response: '', location: 'Dd', dq: '+', determinants: ['F'], fq: 'o', pair: '(2)', contents: ['Hd', 'Cg'], popular: false, z: 'ZD', specialScores: [] },
  { card: 'IV', response: '', location: 'W', dq: '+', determinants: ['FMp', 'FD'], fq: 'u', pair: '(2)', contents: ['Ad', 'Bt'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'IV', response: '', location: 'W', dq: 'o', determinants: ['FMp'], fq: 'u', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: ['INCOM2'] },
  { card: 'V', response: '', location: 'W', dq: 'o', determinants: ['FMa'], fq: 'u', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'VI', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: 'u', pair: 'none', contents: ['Sc'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'VI', response: '', location: 'Dd', dq: 'o', determinants: ["C'F", 'VF'], fq: 'o', pair: 'none', contents: ['An'], popular: false, z: '', specialScores: ['MOR', 'DR1'] },
  { card: 'VII', response: '', location: 'W', dq: '+', determinants: ['FMp'], fq: 'u', pair: '(2)', contents: ['(Ad)', 'Ay', 'Na'], popular: false, z: 'ZW', specialScores: ['COP', 'DR1'] },
  { card: 'VIII', response: '', location: 'D', dq: '+', determinants: ['FMa', 'Cn'], fq: 'o', pair: '(2)', contents: ['A'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'VIII', response: '', location: 'D', dq: 'o', determinants: ['CF'], fq: 'o', pair: 'none', contents: ['Bt'], popular: false, z: '', specialScores: [] },
  { card: 'VIII', response: '', location: 'Dd', dq: '+', determinants: ['FMa-p', 'YF', 'Fr'], fq: 'u', pair: 'none', contents: ['A', 'Na'], popular: true, z: 'ZD', specialScores: ['DR2'] },
  { card: 'IX', response: '', location: 'D', dq: '+', determinants: ['FMa', 'CF', 'TF'], fq: 'u', pair: '(2)', contents: ['A', 'Bt'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'IX', response: '', location: 'DS', dq: '+', determinants: ['FMa', 'FC', 'TF'], fq: 'u', pair: '(2)', contents: ['Ad'], popular: false, z: 'ZS', specialScores: ['INCOM1'] },
  { card: 'IX', response: '', location: 'D', dq: 'o', determinants: ['FC'], fq: '-', pair: 'none', contents: ['A'], popular: false, z: '', specialScores: ['PER'] },
  { card: 'IX', response: '', location: 'D', dq: '+', determinants: ['Mp', 'FD'], fq: '-', pair: 'none', contents: ['Hd', 'An', 'Sx'], popular: false, z: 'ZA', specialScores: ['PER'] },
  { card: 'X', response: '', location: 'W', dq: '+', determinants: ['CF'], fq: 'u', pair: 'none', contents: ['Fd', 'Art', 'A'], popular: true, z: 'ZW', specialScores: [] },
];
