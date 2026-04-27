'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { RorschachResponse } from '@/types';

const STORAGE_KEY = 'rorschach_autosave';
const DEBOUNCE_MS = 2000;
const TTL_MS = 24 * 60 * 60 * 1000;

interface AutoSaveData {
  timestamp: string;
  expiresAt?: string;
  responses: RorschachResponse[];
}

interface UseAutoSaveOptions {
  onSave?: () => void;
}

export function useAutoSave(responses: RorschachResponse[], options?: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const lastSavedRef = useRef<string>('');

  const readSavedData = useCallback((): AutoSaveData | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const data = JSON.parse(saved) as AutoSaveData;
      const savedAt = new Date(data.timestamp).getTime();
      const expiresAt = data.expiresAt
        ? new Date(data.expiresAt).getTime()
        : savedAt + TTL_MS;
      if (!savedAt || !expiresAt || expiresAt <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to read autosave data:', error);
      return null;
    }
  }, []);

  const save = useCallback(() => {
    if (typeof window === 'undefined') return;

    const hasContent = responses.some((response) => response.card);
    if (!hasContent) return;

    const dataString = JSON.stringify(responses);
    if (dataString === lastSavedRef.current) return;

    try {
      const data: AutoSaveData = {
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
        responses,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      lastSavedRef.current = dataString;
      options?.onSave?.();
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [responses, options]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [responses, save]);

  const load = useCallback((): RorschachResponse[] | null => {
    return readSavedData()?.responses ?? null;
  }, [readSavedData]);

  const hasSavedData = useCallback((): boolean => {
    const data = readSavedData();
    return Boolean(data?.responses?.length && data.responses.some((response) => response.card));
  }, [readSavedData]);

  const getSavedTimestamp = useCallback((): string | null => {
    return readSavedData()?.timestamp ?? null;
  }, [readSavedData]);

  const clear = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      lastSavedRef.current = '';
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  return {
    save,
    load,
    clear,
    hasSavedData,
    getSavedTimestamp,
  };
}
