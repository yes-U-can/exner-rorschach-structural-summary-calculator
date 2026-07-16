import type { RorschachResponse } from '@/types';

/**
 * The 17-response, 19-year-old female worked example in Exner's
 * Comprehensive System Workbook (5th ed., Chapter 9).
 */
export const OFFICIAL_WORKBOOK_PROTOCOL: RorschachResponse[] = [
  { card: 'I', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'I', response: '', location: 'D', dq: '+', determinants: ['Ma'], fq: 'o', pair: '(2)', contents: ['H', 'Id'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'I', response: '', location: 'WS', dq: 'o', determinants: ['Ma'], fq: 'u', pair: 'none', contents: ['(Hd)'], popular: false, z: 'ZS', specialScores: [] },
  { card: 'II', response: '', location: 'WS', dq: 'o', determinants: ['Mp', 'CF'], fq: '-', pair: 'none', contents: ['Hd'], popular: false, z: 'ZW', specialScores: ['MOR', 'AB'] },
  { card: 'III', response: '', location: 'D', dq: '+', determinants: ['Ma'], fq: 'o', pair: '(2)', contents: ['H', 'Hh'], popular: true, z: 'ZA', specialScores: ['COP'] },
  { card: 'III', response: '', location: 'WS', dq: 'o', determinants: ['F'], fq: '-', pair: 'none', contents: ['Hd'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'IV', response: '', location: 'W', dq: 'o', determinants: ['FD'], fq: 'o', pair: 'none', contents: ['(A)'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'V', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['A'], popular: true, z: 'ZW', specialScores: [] },
  { card: 'V', response: '', location: 'D', dq: 'o', determinants: ['F'], fq: 'u', pair: 'none', contents: ['(A)'], popular: false, z: '', specialScores: [] },
  { card: 'VI', response: '', location: 'W', dq: 'o', determinants: ['F'], fq: 'o', pair: 'none', contents: ['(A)'], popular: false, z: 'ZW', specialScores: ['MOR', 'DV1'] },
  { card: 'VII', response: '', location: 'D', dq: '+', determinants: ['Ma', 'FY'], fq: 'o', pair: '(2)', contents: ['Hd'], popular: true, z: 'ZD', specialScores: ['AG'] },
  { card: 'VIII', response: '', location: 'W', dq: '+', determinants: ['FMa', 'Fr', 'FC'], fq: 'o', pair: 'none', contents: ['A', 'Na'], popular: true, z: 'ZW', specialScores: ['INCOM1'] },
  { card: 'VIII', response: '', location: 'D', dq: 'v/+', determinants: ['FC', 'FV'], fq: 'o', pair: 'none', contents: ['Ls'], popular: false, z: 'ZA', specialScores: [] },
  { card: 'VIII', response: '', location: 'DdS', dq: 'o', determinants: ['FC'], fq: '-', pair: 'none', contents: ['Ad'], popular: false, z: 'ZS', specialScores: ['PER'] },
  { card: 'IX', response: '', location: 'W', dq: 'v', determinants: ['Ma', 'C'], fq: 'none', pair: 'none', contents: ['Hx'], popular: false, z: '', specialScores: ['AB'] },
  { card: 'X', response: '', location: 'W', dq: '+', determinants: ['Mp'], fq: 'u', pair: 'none', contents: ['(H)', 'Art'], popular: false, z: 'ZW', specialScores: [] },
  { card: 'X', response: '', location: 'DdS', dq: '+', determinants: ['F'], fq: '-', pair: 'none', contents: ['Hd', 'Id'], popular: false, z: 'ZA', specialScores: [] },
];
