import { OPTIONS } from '@/lib/options';
import type { RorschachResponse } from '@/types';

export type CardSortDirection = 'ascending' | 'descending';

const cardOrder = new Map<string, number>(
  OPTIONS.CARDS.map((card, index) => [card, index]),
);

function getCardRank(card: string) {
  return cardOrder.get(card);
}

export function detectCardSortDirection(
  responses: readonly RorschachResponse[],
): CardSortDirection | null {
  let previousRank: number | undefined;
  let direction: CardSortDirection | null = null;

  for (const response of responses) {
    const rank = getCardRank(response.card);
    if (rank === undefined) continue;

    if (previousRank !== undefined && rank !== previousRank) {
      const nextDirection = rank > previousRank ? 'ascending' : 'descending';
      if (direction !== null && direction !== nextDirection) return null;
      direction = nextDirection;
    }

    previousRank = rank;
  }

  return direction;
}

export function getNextCardSortDirection(
  responses: readonly RorschachResponse[],
): CardSortDirection {
  return detectCardSortDirection(responses) === 'ascending'
    ? 'descending'
    : 'ascending';
}

export function sortResponsesByCard(
  responses: readonly RorschachResponse[],
  direction: CardSortDirection,
): RorschachResponse[] {
  return responses
    .map((response, originalIndex) => ({ response, originalIndex }))
    .sort((a, b) => {
      const aRank = getCardRank(a.response.card);
      const bRank = getCardRank(b.response.card);

      if (aRank === undefined && bRank === undefined) {
        return a.originalIndex - b.originalIndex;
      }
      if (aRank === undefined) return 1;
      if (bRank === undefined) return -1;

      if (aRank !== bRank) {
        return direction === 'ascending'
          ? aRank - bRank
          : bRank - aRank;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map(({ response }) => response);
}
