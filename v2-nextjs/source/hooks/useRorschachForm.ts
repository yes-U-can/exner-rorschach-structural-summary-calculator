'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { RorschachResponse, CalculationResult } from '@/types';
import { calculateStructuralSummary } from '@/lib/calculator';
import { SAMPLE_DATA } from '@/lib/sampleData';

const MAX_HISTORY_ENTRIES = 80;

function createEmptyResponse(): RorschachResponse {
  return {
    card: '',
    response: '',
    location: '',
    dq: '',
    determinants: [],
    fq: '',
    pair: 'none',
    contents: [],
    popular: false,
    z: '',
    specialScores: []
  };
}

function cloneResponse(response: RorschachResponse): RorschachResponse {
  return {
    ...response,
    determinants: [...response.determinants],
    contents: [...response.contents],
    specialScores: [...response.specialScores],
  };
}

function cloneResponses(responses: RorschachResponse[]): RorschachResponse[] {
  return responses.map(cloneResponse);
}

function normalizeResponses(responses: RorschachResponse[]): RorschachResponse[] {
  return responses.length > 0 ? cloneResponses(responses) : [createEmptyResponse()];
}

function areResponsesEqual(left: RorschachResponse[], right: RorschachResponse[]) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function useRorschachForm(initialResponses?: RorschachResponse[]) {
  const [responses, setResponsesState] = useState<RorschachResponse[]>(
    normalizeResponses(initialResponses || [createEmptyResponse()])
  );
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [historyPast, setHistoryPast] = useState<RorschachResponse[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<RorschachResponse[][]>([]);
  const responsesRef = useRef(responses);

  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  const commitResponses = useCallback((
    nextInput: RorschachResponse[] | ((prev: RorschachResponse[]) => RorschachResponse[]),
    options?: { recordHistory?: boolean; resetHistory?: boolean },
  ) => {
    const prev = normalizeResponses(responsesRef.current);
    const nextResolved = typeof nextInput === 'function'
      ? nextInput(cloneResponses(prev))
      : nextInput;
    const next = normalizeResponses(nextResolved);

    if (areResponsesEqual(prev, next)) {
      return prev;
    }

    if (options?.resetHistory) {
      setHistoryPast([]);
      setHistoryFuture([]);
    } else {
      if (options?.recordHistory !== false) {
        setHistoryPast((past) => [...past.slice(-(MAX_HISTORY_ENTRIES - 1)), cloneResponses(prev)]);
      }
      setHistoryFuture([]);
    }

    responsesRef.current = next;
    setResponsesState(next);
    return next;
  }, []);

  const setResponses = useCallback((
    nextInput: RorschachResponse[] | ((prev: RorschachResponse[]) => RorschachResponse[]),
  ) => {
    commitResponses(nextInput);
  }, [commitResponses]);

  // Calculate structural summary
  const calculate = useCallback(() => {
    setIsCalculating(true);

    // Filter out empty responses
    const validResponses = responses.filter(r => r.card);

    if (validResponses.length === 0) {
      setResult({
        success: false,
        errors: [{ field: 'responses', message: 'No valid responses to calculate.' }]
      });
      setIsCalculating(false);
      return;
    }

    // Simulate brief calculation time for UX
    setTimeout(() => {
      const calcResult = calculateStructuralSummary(validResponses);
      setResult(calcResult);
      setIsCalculating(false);
      if (calcResult.success) {
        setShowResult(true);
      }
    }, 500);
  }, [responses]);

  // Reset form
  const reset = useCallback(() => {
    commitResponses([createEmptyResponse()], { resetHistory: true });
    setResult(null);
    setShowResult(false);
  }, [commitResponses]);

  // Load sample data
  const loadSampleData = useCallback(() => {
    commitResponses(SAMPLE_DATA, { resetHistory: true });
    setResult(null);
    setShowResult(false);
  }, [commitResponses]);

  // Load custom data
  const loadData = useCallback((data: RorschachResponse[]) => {
    commitResponses(data.length > 0 ? data : [createEmptyResponse()], { resetHistory: true });
    setResult(null);
    setShowResult(false);
  }, [commitResponses]);

  // Back to input
  const backToInput = useCallback(() => {
    setShowResult(false);
  }, []);

  const undo = useCallback(() => {
    if (historyPast.length === 0) return;

    const previous = cloneResponses(historyPast[historyPast.length - 1]);
    const current = normalizeResponses(responsesRef.current);
    setHistoryPast((past) => past.slice(0, -1));
    setHistoryFuture((future) => [cloneResponses(current), ...future].slice(0, MAX_HISTORY_ENTRIES));
    responsesRef.current = previous;
    setResponsesState(previous);
    setResult(null);
    setShowResult(false);
  }, [historyPast]);

  const redo = useCallback(() => {
    if (historyFuture.length === 0) return;

    const next = cloneResponses(historyFuture[0]);
    const current = normalizeResponses(responsesRef.current);
    setHistoryPast((past) => [...past.slice(-(MAX_HISTORY_ENTRIES - 1)), cloneResponses(current)]);
    setHistoryFuture((future) => future.slice(1));
    responsesRef.current = next;
    setResponsesState(next);
    setResult(null);
    setShowResult(false);
  }, [historyFuture]);

  // Get valid response count
  const validResponseCount = useMemo(() => {
    return responses.filter(r => r.card).length;
  }, [responses]);

  return {
    responses,
    setResponses,
    result,
    isCalculating,
    showResult,
    calculate,
    reset,
    loadSampleData,
    loadData,
    backToInput,
    validResponseCount,
    canUndo: historyPast.length > 0,
    canRedo: historyFuture.length > 0,
    undo,
    redo,
  };
}
