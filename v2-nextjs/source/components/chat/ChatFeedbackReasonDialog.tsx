'use client';

import { useId } from 'react';
import type {
  AiFeedbackRating,
  AiFeedbackReasonCode,
  Language,
} from '@/types';
import { AI_FEEDBACK_REASON_CODES_BY_RATING } from '@/lib/aiFeedbackReasons';
import { getChatFeedbackReasonsUi } from '@/lib/chatFeedbackReasonsUi';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export function ChatFeedbackReasonDialog({
  isOpen,
  rating,
  language,
  selectedReasonCodes,
  pending,
  errorMessage,
  onToggleReason,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  rating: AiFeedbackRating;
  language: Language;
  selectedReasonCodes: AiFeedbackReasonCode[];
  pending: boolean;
  errorMessage: string;
  onToggleReason: (reasonCode: AiFeedbackReasonCode) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const ui = getChatFeedbackReasonsUi(language);
  const privacyId = useId();
  const reasonCodes = AI_FEEDBACK_REASON_CODES_BY_RATING[rating];

  return (
    <Modal
      isOpen={isOpen}
      onClose={pending ? () => undefined : onClose}
      title={ui.title}
      size="md"
      closeLabel={ui.close}
    >
      <div className="space-y-4">
        <fieldset
          className="grid gap-2 sm:grid-cols-2"
          aria-describedby={privacyId}
          disabled={pending}
        >
          <legend className="sr-only">{ui.title}</legend>
          {reasonCodes.map((reasonCode) => {
            const selected = selectedReasonCodes.includes(reasonCode);
            return (
              <label
                key={reasonCode}
                className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm leading-5 transition-colors ${
                  selected
                    ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--text-strong)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-body)] hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggleReason(reasonCode)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-subtle)] text-[var(--brand-700)] focus:ring-[var(--brand-500)]"
                />
                <span>{ui.reasonLabels[reasonCode]}</span>
              </label>
            );
          })}
        </fieldset>

        <p id={privacyId} className="text-xs leading-5 text-[var(--text-soft)]">
          {ui.privacyNote}
        </p>
        {errorMessage ? (
          <p className="text-sm text-[var(--danger-text)]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
            {ui.skip}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            disabled={pending || selectedReasonCodes.length === 0}
          >
            {pending ? ui.submitting : ui.submit}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
