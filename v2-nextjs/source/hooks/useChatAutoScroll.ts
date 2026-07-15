'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
  type PointerEventHandler,
  type TouchEventHandler,
  type UIEventHandler,
  type WheelEventHandler,
} from 'react';

const DEFAULT_BOTTOM_THRESHOLD_PX = 80;
const EXACT_BOTTOM_THRESHOLD_PX = 4;

export function getChatDistanceFromBottom(element: Pick<HTMLElement, 'scrollHeight' | 'scrollTop' | 'clientHeight'>) {
  return Math.max(0, element.scrollHeight - element.scrollTop - element.clientHeight);
}

export function isChatAtBottom(
  element: Pick<HTMLElement, 'scrollHeight' | 'scrollTop' | 'clientHeight'>,
  thresholdPx = EXACT_BOTTOM_THRESHOLD_PX,
) {
  return getChatDistanceFromBottom(element) <= thresholdPx;
}

export function shouldResumeChatFollowing(args: {
  wasUserPaused: boolean;
  previousScrollTop: number;
  currentScrollTop: number;
  distanceFromBottom: number;
  bottomThresholdPx: number;
}) {
  if (args.distanceFromBottom > args.bottomThresholdPx) return false;
  if (!args.wasUserPaused) return true;
  return args.currentScrollTop > args.previousScrollTop;
}

export function useChatAutoScroll(args: {
  messageCount: number;
  latestContent: string;
  bottomThresholdPx?: number;
}) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const followingRef = useRef(true);
  const userPausedRef = useRef(false);
  const previousScrollTopRef = useRef(0);
  const touchYRef = useRef<number | null>(null);
  const [isFollowing, setIsFollowingState] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const setIsFollowing = useCallback((next: boolean) => {
    followingRef.current = next;
    setIsFollowingState((current) => (current === next ? current : next));
  }, []);

  const cancelScheduledScroll = useCallback(() => {
    if (animationFrameRef.current === null) return;
    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }, []);

  const scheduleScrollToLatest = useCallback((behavior: ScrollBehavior = 'auto') => {
    if (!followingRef.current) return;
    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      const element = scrollContainerRef.current;
      if (!element || !followingRef.current) return;
      element.scrollTo({ top: element.scrollHeight, behavior });
      setIsAtBottom(isChatAtBottom(element));
    });
  }, []);

  const pauseFollowing = useCallback(() => {
    cancelScheduledScroll();
    const element = scrollContainerRef.current;
    if (element) previousScrollTopRef.current = element.scrollTop;
    userPausedRef.current = true;
    setIsFollowing(false);
  }, [cancelScheduledScroll, setIsFollowing]);

  const resumeFollowing = useCallback((behavior: ScrollBehavior = 'smooth') => {
    cancelScheduledScroll();
    userPausedRef.current = false;
    setIsFollowing(true);
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      const element = scrollContainerRef.current;
      if (!element) return;
      element.scrollTo({ top: element.scrollHeight, behavior });
      previousScrollTopRef.current = element.scrollHeight;
    });
  }, [cancelScheduledScroll, setIsFollowing]);

  const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>(() => {
    const element = scrollContainerRef.current;
    if (!element) return;
    const threshold = args.bottomThresholdPx ?? DEFAULT_BOTTOM_THRESHOLD_PX;
    const currentScrollTop = element.scrollTop;
    setIsAtBottom(isChatAtBottom(element));
    const shouldResume = shouldResumeChatFollowing({
      wasUserPaused: userPausedRef.current,
      previousScrollTop: previousScrollTopRef.current,
      currentScrollTop,
      distanceFromBottom: getChatDistanceFromBottom(element),
      bottomThresholdPx: threshold,
    });
    previousScrollTopRef.current = currentScrollTop;
    if (shouldResume) {
      userPausedRef.current = false;
      setIsFollowing(true);
    }
  }, [args.bottomThresholdPx, setIsFollowing]);

  const handleWheel = useCallback<WheelEventHandler<HTMLDivElement>>((event) => {
    if (event.deltaY < 0) pauseFollowing();
  }, [pauseFollowing]);

  const handlePointerDown = useCallback<PointerEventHandler<HTMLDivElement>>((event) => {
    const element = scrollContainerRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (event.clientX >= rect.right - 20) pauseFollowing();
  }, [pauseFollowing]);

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>((event) => {
    if (event.key === 'ArrowUp' || event.key === 'PageUp' || event.key === 'Home') {
      pauseFollowing();
    }
  }, [pauseFollowing]);

  const handleTouchStart = useCallback<TouchEventHandler<HTMLDivElement>>((event) => {
    touchYRef.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchMove = useCallback<TouchEventHandler<HTMLDivElement>>((event) => {
    const nextY = event.touches[0]?.clientY ?? null;
    const previousY = touchYRef.current;
    touchYRef.current = nextY;
    if (nextY !== null && previousY !== null && nextY > previousY + 2) {
      pauseFollowing();
    }
  }, [pauseFollowing]);

  const handleTouchEnd = useCallback(() => {
    touchYRef.current = null;
  }, []);

  useEffect(() => {
    scheduleScrollToLatest('auto');
  }, [args.latestContent, args.messageCount, scheduleScrollToLatest]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const handleViewportChange = () => scheduleScrollToLatest('auto');
    const resizeObserver = new ResizeObserver(handleViewportChange);
    resizeObserver.observe(element);
    window.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('resize', handleViewportChange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
    };
  }, [scheduleScrollToLatest]);

  useEffect(() => cancelScheduledScroll, [cancelScheduledScroll]);

  return {
    scrollContainerRef,
    isFollowing,
    isAtBottom,
    pauseFollowing,
    resumeFollowing,
    scrollHandlers: {
      onScroll: handleScroll,
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
}
