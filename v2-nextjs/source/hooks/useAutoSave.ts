'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { RorschachResponse } from '@/types';
import {
  DETERMINANT_INPUT_CODES,
  LEGACY_BARE_MOVEMENT_INPUT_CODES,
  OPTIONS,
} from '@/lib/options';

const STORAGE_KEY = 'rorschach_autosave';
const DEBOUNCE_MS = 2000;
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_RESPONSE_MEMO_LENGTH = 50_000;

export interface AutoSaveData {
  timestamp: string;
  expiresAt?: string;
  responses: RorschachResponse[];
}

export interface AutoSaveStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
}

export interface AutoSaveStorageHost {
  readonly localStorage: AutoSaveStorage;
}

interface UseAutoSaveOptions {
  onSave?: () => void;
}

const cards = new Set<string>(OPTIONS.CARDS);
const locations = new Set<string>(OPTIONS.LOCATIONS);
const developmentalQualities = new Set<string>(OPTIONS.DQ);
const formQualities = new Set<string>(OPTIONS.FQ);
const pairs = new Set<string>(OPTIONS.PAIR);
const zTypes = new Set<string>(OPTIONS.Z_TYPES);
const determinants = new Set<string>([
  ...DETERMINANT_INPUT_CODES,
  ...LEGACY_BARE_MOVEMENT_INPUT_CODES,
]);
const contents = new Set<string>(OPTIONS.CONTENTS);
const specialScores = new Set<string>(OPTIONS.SPECIAL_SCORES);

function isAllowedString(value: unknown, allowed: Set<string>, allowEmpty = true): value is string {
  return typeof value === 'string' && ((allowEmpty && value === '') || allowed.has(value));
}

function normalizeCodeArray(
  value: unknown,
  allowed: Set<string>,
  maxLength: number,
): string[] | null {
  if (!Array.isArray(value) || value.length > maxLength) return null;

  const normalized = value.filter((item) => item !== '');
  if (!normalized.every((item) => typeof item === 'string' && allowed.has(item))) {
    return null;
  }

  return normalized;
}

function normalizeSavedResponse(value: unknown): RorschachResponse | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const response = value as Record<string, unknown>;
  const normalizedDeterminants = normalizeCodeArray(response.determinants, determinants, 6);
  const normalizedContents = normalizeCodeArray(response.contents, contents, 6);
  const normalizedSpecialScores = normalizeCodeArray(response.specialScores, specialScores, 8);

  if (
    !isAllowedString(response.card, cards)
    || typeof response.response !== 'string'
    || response.response.length > MAX_RESPONSE_MEMO_LENGTH
    || !isAllowedString(response.location, locations)
    || !isAllowedString(response.dq, developmentalQualities)
    || normalizedDeterminants === null
    || !isAllowedString(response.fq, formQualities)
    || !isAllowedString(response.pair, pairs, false)
    || normalizedContents === null
    || typeof response.popular !== 'boolean'
    || !isAllowedString(response.z, zTypes)
    || normalizedSpecialScores === null
  ) {
    return null;
  }

  return {
    card: response.card,
    response: response.response,
    location: response.location,
    dq: response.dq,
    determinants: normalizedDeterminants,
    fq: response.fq,
    pair: response.pair,
    contents: normalizedContents,
    popular: response.popular,
    z: response.z,
    specialScores: normalizedSpecialScores,
  };
}

export function parseAutoSaveData(
  value: unknown,
  now = Date.now(),
): AutoSaveData | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const data = value as Record<string, unknown>;
  if (typeof data.timestamp !== 'string' || !Array.isArray(data.responses)) return null;

  const savedAt = Date.parse(data.timestamp);
  const expiresAt = data.expiresAt === undefined
    ? savedAt + TTL_MS
    : typeof data.expiresAt === 'string'
      ? Date.parse(data.expiresAt)
      : Number.NaN;

  if (
    !Number.isFinite(savedAt)
    || !Number.isFinite(expiresAt)
    || expiresAt <= now
    || data.responses.length > 200
  ) {
    return null;
  }

  const normalizedResponses = data.responses.map(normalizeSavedResponse);
  if (normalizedResponses.some((response) => response === null)) return null;

  return {
    timestamp: data.timestamp,
    ...(typeof data.expiresAt === 'string' ? { expiresAt: data.expiresAt } : {}),
    responses: normalizedResponses as RorschachResponse[],
  };
}

export function readAutoSaveDataFromStorage(
  storage: AutoSaveStorage,
  now = Date.now(),
): AutoSaveData | null {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const data = parseAutoSaveData(JSON.parse(saved), now);
    if (data) return data;
  } catch (error) {
    console.error('Failed to read autosave data:', error);
  }

  try {
    storage.removeItem(STORAGE_KEY);
  } catch (cleanupError) {
    console.error('Failed to remove invalid autosave data:', cleanupError);
  }
  return null;
}

export function readAutoSaveDataFromHost(
  host: AutoSaveStorageHost,
  now = Date.now(),
): AutoSaveData | null {
  try {
    return readAutoSaveDataFromStorage(host.localStorage, now);
  } catch (error) {
    console.error('Failed to access autosave storage:', error);
    return null;
  }
}

export function useAutoSave(responses: RorschachResponse[], options?: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const lastSavedRef = useRef<string>('');
  const protectedSnapshotRef = useRef<string | null>(null);
  const responsesRef = useRef(responses);
  const onSaveRef = useRef(options?.onSave);

  useEffect(() => {
    responsesRef.current = responses;
    onSaveRef.current = options?.onSave;
  }, [options?.onSave, responses]);

  const readSavedData = useCallback((): AutoSaveData | null => {
    if (typeof window === 'undefined') return null;
    return readAutoSaveDataFromHost(window);
  }, []);

  const save = useCallback(() => {
    if (typeof window === 'undefined') return;

    const latestResponses = responsesRef.current;
    const hasContent = latestResponses.some((response) => response.card);
    if (!hasContent) return;

    const dataString = JSON.stringify(latestResponses);
    const protectedSnapshot = protectedSnapshotRef.current;
    protectedSnapshotRef.current = null;
    if (dataString === protectedSnapshot) {
      lastSavedRef.current = dataString;
      return;
    }
    if (dataString === lastSavedRef.current) return;

    try {
      const data: AutoSaveData = {
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
        responses: latestResponses,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      lastSavedRef.current = dataString;
      onSaveRef.current?.();
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, []);

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

  useEffect(() => {
    const flushPendingSave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      save();
    };

    window.addEventListener('pagehide', flushPendingSave);
    return () => {
      window.removeEventListener('pagehide', flushPendingSave);
      flushPendingSave();
    };
  }, [save]);

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

  const preserveSavedDataFor = useCallback((nextResponses: RorschachResponse[]) => {
    if (!readSavedData()) return;
    protectedSnapshotRef.current = JSON.stringify(nextResponses);
  }, [readSavedData]);

  const clear = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      lastSavedRef.current = '';
      protectedSnapshotRef.current = null;
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
    preserveSavedDataFor,
  };
}
