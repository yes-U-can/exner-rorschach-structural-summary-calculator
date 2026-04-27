function normalize(content: string): string {
  return content.toLowerCase().trim();
}

export function isSystemBootstrapMessage(content: string): boolean {
  const normalized = normalize(content);

  return normalized.includes('[structural_summary_csv]');
}

export function getCondensedSystemMessage(content: string): string | null {
  if (isSystemBootstrapMessage(content)) {
    return '[구조요약 CSV가 해석 대화의 참고 자료로 추가되었습니다.]';
  }
  return null;
}
