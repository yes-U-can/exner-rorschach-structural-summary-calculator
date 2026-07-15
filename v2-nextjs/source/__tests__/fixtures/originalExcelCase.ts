import type { RorschachResponse } from '@/types';

/**
 * Score-only transcription of the 16 populated rows in the user's original
 * 2019 Excel calculator. The legacy m'a notation is normalized to the v2
 * `ma` code. No response wording or identifying information is included.
 *
 * Source workbook: Scoring!C5:AD20
 * Expected summary: Upper_Section, Lower_Section, and Special_Indices sheets
 */
export const ORIGINAL_EXCEL_CASE: RorschachResponse[] = [
  { card: 'I', response: '', location: 'W', dq: 'o', determinants: ['FMa'], fq: 'u', pair: '(2)', contents: ['A'], popular: false, z: 'ZW', specialScores: ['INCOM1'] },
  { card: 'I', response: '', location: 'W', dq: '+', determinants: ['Mp'], fq: 'o', pair: '(2)', contents: ['(H)'], popular: false, z: 'ZW', specialScores: ['AG'] },
  { card: 'I', response: '', location: 'WS', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['Art'], popular: false, z: 'ZS', specialScores: [] },
  { card: 'II', response: '', location: 'D', dq: '+', determinants: ['FMa', 'FC'], fq: '-', pair: '(2)', contents: ['A', 'Sc'], popular: false, z: 'ZA', specialScores: ['ALOG'] },
  { card: 'III', response: '', location: 'D', dq: '+', determinants: ['Ma'], fq: 'u', pair: '(2)', contents: ['H', 'Sc'], popular: false, z: 'ZD', specialScores: [] },
  { card: 'IV', response: '', location: 'W', dq: '+', determinants: ['Ma', "FC'", 'FD'], fq: '-', pair: '(2)', contents: ['(H)', 'Hh'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'V', response: '', location: 'W', dq: '+', determinants: ['FMa', 'FY'], fq: '-', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: ['INCOM1'] },
  { card: 'V', response: '', location: 'W', dq: 'o', determinants: ['FMa'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'V', response: '', location: 'W', dq: 'o', determinants: ['FMa'], fq: 'o', pair: 'none', contents: ['A'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'VI', response: '', location: 'Dd', dq: 'o', determinants: ['FMa'], fq: '-', pair: 'none', contents: ['A'], popular: false, z: '', specialScores: [] },
  { card: 'VII', response: '', location: 'Dd', dq: '+', determinants: ['Mp'], fq: '-', pair: 'none', contents: ['(H)', 'A', 'Sx'], popular: true, z: 'ZA', specialScores: [] },
  { card: 'VII', response: '', location: 'Dd', dq: 'o', determinants: ['F'], fq: '-', pair: 'none', contents: ['A'], popular: false, z: '', specialScores: ['INCOM1'] },
  { card: 'VIII', response: '', location: 'W', dq: '+', determinants: ['F'], fq: '-', pair: 'none', contents: ['An'], popular: false, z: 'ZW', specialScores: ['PER'] },
  { card: 'VIII', response: '', location: 'D', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: '', specialScores: [] },
  { card: 'IX', response: '', location: 'W', dq: '+', determinants: ['ma'], fq: 'o', pair: 'none', contents: ['Fi', 'Hh'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'X', response: '', location: 'W', dq: '+', determinants: ['FC'], fq: '-', pair: 'none', contents: ['An'], popular: false, z: 'ZW', specialScores: [] },
];
