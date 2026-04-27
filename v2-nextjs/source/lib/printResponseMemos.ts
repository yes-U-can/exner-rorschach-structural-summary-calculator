import type { RorschachResponse } from '@/types';

export const PRINT_CARD_ORDER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const;

export type PrintResponseMemoGroup = {
  key: string;
  cardLabel: string;
  responses: string[];
};

function normalizeCardLabel(card: string) {
  return card.trim().toUpperCase();
}

export function buildPrintResponseMemoGroups(responses: RorschachResponse[]): PrintResponseMemoGroup[] {
  const groups = PRINT_CARD_ORDER.map((cardLabel) => ({
    key: cardLabel,
    cardLabel,
    responses: [] as string[],
  }));

  const responseMap = new Map<string, string[]>(groups.map((group) => [group.cardLabel, group.responses]));

  responses.forEach((response) => {
    const text = response.response.trim();
    if (!text) return;

    const cardLabel = normalizeCardLabel(response.card);
    const bucket = responseMap.get(cardLabel);
    if (!bucket) return;

    bucket.push(text);
  });

  return groups;
}
