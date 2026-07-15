'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useChatRequestControl() {
  const activeRequestRef = useRef<AbortController | null>(null);

  const beginRequest = useCallback(() => {
    activeRequestRef.current?.abort('superseded');
    const controller = new AbortController();
    activeRequestRef.current = controller;
    return controller;
  }, []);

  const finishRequest = useCallback((controller: AbortController) => {
    if (activeRequestRef.current === controller) {
      activeRequestRef.current = null;
    }
  }, []);

  const stopRequest = useCallback(() => {
    activeRequestRef.current?.abort('user_stopped');
  }, []);

  useEffect(() => () => {
    activeRequestRef.current?.abort('component_unmounted');
  }, []);

  return { beginRequest, finishRequest, stopRequest };
}
