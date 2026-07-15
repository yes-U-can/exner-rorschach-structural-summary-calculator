import { describe, expect, it } from 'vitest';
import {
  getChatDistanceFromBottom,
  isChatAtBottom,
  shouldResumeChatFollowing,
} from '@/hooks/useChatAutoScroll';

describe('chat auto-scroll geometry', () => {
  it('detects the bottom without relying on a document-level anchor', () => {
    expect(getChatDistanceFromBottom({
      scrollHeight: 1_200,
      scrollTop: 700,
      clientHeight: 500,
    })).toBe(0);
  });

  it('measures how far the user moved into older messages', () => {
    expect(getChatDistanceFromBottom({
      scrollHeight: 1_200,
      scrollTop: 460,
      clientHeight: 500,
    })).toBe(240);
  });

  it('shows bottom-only UI only at the actual bottom edge', () => {
    expect(isChatAtBottom({
      scrollHeight: 1_200,
      scrollTop: 696,
      clientHeight: 500,
    })).toBe(true);
    expect(isChatAtBottom({
      scrollHeight: 1_200,
      scrollTop: 695,
      clientHeight: 500,
    })).toBe(false);
  });

  it('keeps a manual pause when the user moves upward near the bottom', () => {
    expect(shouldResumeChatFollowing({
      wasUserPaused: true,
      previousScrollTop: 700,
      currentScrollTop: 675,
      distanceFromBottom: 25,
      bottomThresholdPx: 80,
    })).toBe(false);
  });

  it('resumes only after a paused user moves back down near the bottom', () => {
    expect(shouldResumeChatFollowing({
      wasUserPaused: true,
      previousScrollTop: 640,
      currentScrollTop: 680,
      distanceFromBottom: 20,
      bottomThresholdPx: 80,
    })).toBe(true);
  });
});
