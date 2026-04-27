'use client';

import { useMemo } from 'react';
import type { RorschachResponse } from '@/types';
import { OPTIONS } from '@/lib/options';
import { SCORING_CONFIG } from '@/lib/constants';
import SlotSelect from './SlotSelect';
import DeterminantSlots from './DeterminantSlots';
import ContentSlots from './ContentSlots';
import SpecialScoreSlots from './SpecialScoreSlots';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MobileCardProps {
  responses: RorschachResponse[];
  onChange: (responses: RorschachResponse[]) => void;
  currentIndex: number;
  onCurrentIndexChange: (index: number) => void;
  onAddRowRequest: (rowIndices: number[]) => void;
  onDeleteRowsRequest: (rowIndices: number[]) => void;
  maxRows?: number;
}

function calculateZScore(response: RorschachResponse): number | null {
  if (!response.card || !response.z) return null;
  const Z_TABLE = SCORING_CONFIG.TABLES.Z_SCORE;
  const cardScores = Z_TABLE[response.card as keyof typeof Z_TABLE];
  if (!cardScores) return null;
  const score = cardScores[response.z as keyof typeof cardScores];
  return typeof score === 'number' ? score : null;
}

function classifyGPHR(response: RorschachResponse): string {
  const humanContentCodes = SCORING_CONFIG.CODES.HUMAN_CONTENT_GPHR as readonly string[];
  const humanMovementCodes = SCORING_CONFIG.CODES.HUMAN_MOVEMENT as readonly string[];
  const animalMovementCodes = SCORING_CONFIG.CODES.ANIMAL_MOVEMENT as readonly string[];
  const copOrAgCodes = SCORING_CONFIG.CODES.COP_OR_AG as readonly string[];
  const fqGoodCodes = SCORING_CONFIG.CODES.FQ_GOOD as readonly string[];
  const cognitiveSsBadCodes = SCORING_CONFIG.CODES.COGNITIVE_SS_BAD as readonly string[];
  const agOrMorCodes = SCORING_CONFIG.CODES.AG_OR_MOR as readonly string[];
  const fqBadCodes = SCORING_CONFIG.CODES.FQ_BAD as readonly string[];
  const level2SsCodes = SCORING_CONFIG.CODES.LEVEL_2_SS as readonly string[];
  const gphrPopularCards = SCORING_CONFIG.CODES.GPHR_POPULAR_CARDS as readonly string[];

  const hasHumanContent = response.contents.some(c => humanContentCodes.includes(c));
  const hasHumanMovement = response.determinants.some(d => humanMovementCodes.includes(d));
  const hasAnimalMovement = response.determinants.some(d => animalMovementCodes.includes(d));
  const hasCopOrAg = response.specialScores.some(s => copOrAgCodes.includes(s));

  const isEligible = hasHumanContent || hasHumanMovement || (hasAnimalMovement && hasCopOrAg);
  if (!isEligible) return '';

  const isPureH = response.contents.includes('H');
  const isGoodFQ = fqGoodCodes.includes(response.fq);
  const hasBadCognitiveSS = response.specialScores.some(s => cognitiveSsBadCodes.includes(s));
  const hasAgOrMor = response.specialScores.some(s => agOrMorCodes.includes(s));

  if (isPureH && isGoodFQ && !hasBadCognitiveSS && !hasAgOrMor) {
    return 'GHR';
  }

  const isBadFQ = fqBadCodes.includes(response.fq);
  const hasLevel2SS = response.specialScores.some(s => level2SsCodes.includes(s));

  if (isBadFQ || hasLevel2SS) return 'PHR';
  if (response.specialScores.includes('COP') && !response.specialScores.includes('AG')) return 'GHR';
  if (response.specialScores.includes('FABCOM1') || response.specialScores.includes('MOR') || response.contents.includes('An')) return 'PHR';
  if (response.popular && gphrPopularCards.includes(response.card)) return 'GHR';
  if (response.specialScores.includes('AG') || response.specialScores.includes('INCOM1') || response.specialScores.includes('DR1') || response.contents.includes('Hd')) return 'PHR';

  return 'GHR';
}

export default function MobileCard({
  responses,
  onChange,
  currentIndex,
  onCurrentIndexChange,
  onAddRowRequest,
  onDeleteRowsRequest,
  maxRows = 50,
}: MobileCardProps) {
  const currentResponse = useMemo(
    () => responses[currentIndex] || {
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
      specialScores: [],
    },
    [currentIndex, responses],
  );

  const zScore = useMemo(() => calculateZScore(currentResponse), [currentResponse]);
  const gphr = useMemo(() => classifyGPHR(currentResponse), [currentResponse]);
  const hasReflection = useMemo(
    () => currentResponse.determinants.some(d => d === 'Fr' || d === 'rF'),
    [currentResponse.determinants]
  );
  const isDqVague = currentResponse.dq === 'v';

  const updateField = <K extends keyof RorschachResponse>(field: K, value: RorschachResponse[K]) => {
    const next = { ...currentResponse, [field]: value };

    // Keep the same domain constraints as desktop row input.
    if ((field === 'determinants' || field === 'pair') && hasReflection && next.pair === '(2)') {
      next.pair = 'none';
    }
    if ((field === 'dq' || field === 'fq') && next.dq === 'v' && next.fq === '+') {
      next.fq = '';
    }
    if ((field === 'dq' || field === 'z') && next.dq === 'v' && next.z !== '') {
      next.z = '';
    }

    const newResponses = [...responses];
    newResponses[currentIndex] = next;
    onChange(newResponses);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onCurrentIndexChange(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < responses.length - 1) {
      onCurrentIndexChange(currentIndex + 1);
    }
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < responses.length) {
      onCurrentIndexChange(index);
    }
  };

  const addRow = () => {
    if (responses.length < maxRows) {
      onAddRowRequest([currentIndex]);
    }
  };

  const removeLastRow = () => {
    if (responses.length > 1) {
      onDeleteRowsRequest([currentIndex]);
    }
  };

  const progress = ((currentIndex + 1) / responses.length) * 100;

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6 text-[var(--text-body)] shadow-sm">
      {/* Progress Bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full rounded-full bg-[var(--brand-700)] transition-[colors,transform] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[var(--text-strong)]">
          Response {currentIndex + 1} / {responses.length}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={addRow}
            disabled={responses.length >= maxRows}
            aria-label="Add response row"
            className="rounded-lg bg-[var(--brand-100)] p-2 text-[var(--brand-700)] transition-colors hover:bg-[var(--brand-50)] disabled:opacity-50"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <button
            onClick={removeLastRow}
            disabled={responses.length <= 1}
            aria-label="Delete last response row"
            className="rounded-lg bg-[var(--danger-hover-bg)] p-2 text-[var(--danger-text)] transition-colors hover:border-[var(--danger-hover-border)] disabled:opacity-50"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Row 1: Card, Location, DQ */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Card</label>
            <SlotSelect
              value={currentResponse.card}
              onChange={(v) => updateField('card', v)}
              options={OPTIONS.CARDS}
              showClearButton
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Location</label>
            <SlotSelect
              value={currentResponse.location}
              onChange={(v) => updateField('location', v)}
              options={OPTIONS.LOCATIONS}
              showClearButton
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">DQ</label>
            <SlotSelect
              value={currentResponse.dq}
              onChange={(v) => updateField('dq', v)}
              options={OPTIONS.DQ}
              showClearButton
              className="w-full"
            />
          </div>
        </div>

        {/* Determinants */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Determinants</label>
          <DeterminantSlots
            values={currentResponse.determinants}
            onChange={(v) => updateField('determinants', v)}
          />
        </div>

        {/* Row 2: FQ, Pair, Z */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">FQ</label>
            <SlotSelect
              value={currentResponse.fq}
              onChange={(v) => updateField('fq', v)}
              options={OPTIONS.FQ}
              disabledOptions={isDqVague ? ['+'] : undefined}
              showClearButton
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Pair</label>
            <div className="flex h-10 items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3">
              <input
                type="checkbox"
                checked={currentResponse.pair === '(2)'}
                onChange={(e) => updateField('pair', e.target.checked ? '(2)' : 'none')}
                disabled={hasReflection}
                className={`h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--brand-700)] focus:ring-[var(--brand-500)]
                  ${hasReflection ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Z</label>
            <SlotSelect
              value={currentResponse.z}
              onChange={(v) => updateField('z', v)}
              options={OPTIONS.Z_TYPES}
              disabled={isDqVague}
              showClearButton
              className="w-full"
            />
          </div>
        </div>

        {/* Contents */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Contents</label>
          <ContentSlots
            values={currentResponse.contents}
            onChange={(v) => updateField('contents', v)}
          />
        </div>

        {/* Popular */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[var(--text-soft)]">P</label>
          <input
            type="checkbox"
            checked={currentResponse.popular}
            onChange={(e) => updateField('popular', e.target.checked)}
            className="h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--brand-700)] focus:ring-[var(--brand-500)]"
          />
        </div>

        {/* Special Scores */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Special Score</label>
          <SpecialScoreSlots
            values={currentResponse.specialScores}
            onChange={(v) => updateField('specialScores', v)}
          />
        </div>

        {/* Response Text */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--text-soft)]">Response</label>
          <textarea
            value={currentResponse.response}
            onChange={(e) => updateField('response', e.target.value)}
            className="h-20 w-full resize-none rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-body)] placeholder:text-[var(--text-soft)]
              focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            placeholder="..."
          />
        </div>

        {/* Calculated Score */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4 rounded-lg bg-[var(--surface-muted)] px-4 py-2">
            <div>
              <span className="text-sm font-medium text-[var(--text-soft)]">Score: </span>
              <span className="text-lg font-bold text-[var(--brand-700)]">
                {zScore !== null ? zScore.toFixed(1) : '-'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--text-soft)]">G/PHR: </span>
              <span className={`text-lg font-bold ${
                gphr === 'GHR' ? 'text-emerald-600'
                : gphr === 'PHR' ? 'text-rose-500'
                : 'text-[var(--text-soft)]'
              }`}>
                {gphr || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous response"
          className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-4 text-lg font-bold text-[var(--text-soft)] transition-[colors,transform] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] disabled:opacity-50"
        >
          <ChevronLeftIcon className="w-6 h-6 mx-auto" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === responses.length - 1}
          aria-label="Next response"
          className="flex-1 rounded-lg bg-[var(--brand-700)] px-4 py-4 text-lg font-bold text-[var(--on-brand)] shadow-lg shadow-[var(--brand-700)]/20 transition-[colors,transform] hover:bg-[var(--brand-700-hover)] hover:shadow-[var(--brand-700)]/20 disabled:opacity-50"
        >
          <ChevronRightIcon className="w-6 h-6 mx-auto" />
        </button>
      </div>

      {/* Pagination */}
      <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {responses.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => goToIndex(index)}
                aria-label={`Go to response ${index + 1}`}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-9 h-9 px-2 rounded-full text-sm font-semibold border transition-colors ${
                  isActive
                    ? 'border-[var(--brand-700)] bg-[var(--brand-700)] text-[var(--on-brand)]'
                    : 'border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-soft)] hover:bg-[var(--surface-muted)]'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}











