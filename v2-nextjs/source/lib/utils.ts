/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Rorschach Calculator v2.2.3
 * Utility Functions
 * 
 * Code.gs의 유틸리티 함수들을 TypeScript로 이전
 */

/**
 * 입력값을 안전한 문자열로 변환합니다 (null/undefined -> '', trim)
 */
export function val(x: any): string {
  if (x === null || x === undefined) return '';
  const t = String(x).trim();
  return t === '' ? '' : t;
}

/**
 * 숫자를 소수점 첫째 자리 문자열로 포맷합니다.
 */
export function fix1(n: number | string): string {
  return Number(n).toFixed(1);
}

/**
 * 숫자를 소수점 둘째 자리 문자열로 포맷합니다.
 */
export function fix2(n: number | string): string {
  return Number(n).toFixed(2);
}

/**
 * Zf 값에 해당하는 ZEst 값을 반환합니다.
 */
export function zestFromZf(zf: number, zestTable: readonly (number | null)[]): number | null {
  if (typeof zf !== 'number' || !Number.isFinite(zf) || !Number.isInteger(zf)) return null;
  if (zf < 1 || zf > zestTable.length) return null;
  const value = zestTable[zf - 1];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * (EA - es) 값을 2.5점 간격의 D 점수로 변환합니다.
 */
export function dTable(
  x: number,
  divisor: number = 2.5,
): number | '-' {
  if (typeof x !== 'number' || !Number.isFinite(x)) return '-';
  if (x >= -divisor && x <= divisor) return 0;

  // The printed conversion table shows the usual -5..+5 range, but the
  // underlying rule continues in 2.5-point units outside that range.
  return x > divisor
    ? Math.ceil((x - divisor) / divisor)
    : -Math.ceil((Math.abs(x) - divisor) / divisor);
}

