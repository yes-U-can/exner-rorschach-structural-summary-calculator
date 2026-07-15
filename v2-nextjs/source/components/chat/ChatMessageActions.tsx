'use client';

import { useEffect, useState } from 'react';
import {
  CheckIcon,
  ClipboardDocumentIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import type {
  AiFeedbackRating,
  AiFeedbackReasonCode,
  Language,
} from '@/types';
import { getChatMessageActionsUi } from '@/lib/chatMessageActionsUi';
import { copyChatText } from '@/lib/chatClipboard';
import { ChatFeedbackReasonDialog } from '@/components/chat/ChatFeedbackReasonDialog';

type CopyState = 'idle' | 'copied' | 'failed';

export function ChatMessageActions({
  content,
  language,
  feedbackRating = null,
  feedbackDisabled = false,
  onFeedback,
}: {
  content: string;
  language: Language;
  feedbackRating?: AiFeedbackRating | null;
  feedbackDisabled?: boolean;
  onFeedback?: (
    rating: AiFeedbackRating | null,
    reasonCodes: AiFeedbackReasonCode[],
  ) => Promise<void>;
}) {
  const ui = getChatMessageActionsUi(language);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [reasonDialogRating, setReasonDialogRating] = useState<AiFeedbackRating | null>(null);
  const [selectedReasonCodes, setSelectedReasonCodes] = useState<AiFeedbackReasonCode[]>([]);
  const [reasonDialogError, setReasonDialogError] = useState('');

  useEffect(() => {
    if (copyState === 'idle') return;
    const timeoutId = window.setTimeout(() => setCopyState('idle'), 1_800);
    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  const copyLabel = copyState === 'copied'
    ? ui.copied
    : copyState === 'failed'
      ? ui.copyFailed
      : ui.copy;

  const handleCopy = async () => {
    try {
      await copyChatText(content);
      setCopyState('copied');
      setStatusMessage(ui.copied);
    } catch {
      setCopyState('failed');
      setStatusMessage(ui.copyFailed);
    }
  };

  const handleFeedback = async (rating: AiFeedbackRating) => {
    if (!onFeedback || feedbackPending || feedbackDisabled) return;
    const nextRating = feedbackRating === rating ? null : rating;
    setFeedbackPending(true);
    setReasonDialogError('');
    try {
      await onFeedback(nextRating, []);
      setStatusMessage(nextRating ? ui.feedbackSaved : ui.feedbackRemoved);
      if (nextRating) {
        setSelectedReasonCodes([]);
        setReasonDialogRating(nextRating);
      } else {
        setReasonDialogRating(null);
        setSelectedReasonCodes([]);
      }
    } catch {
      setStatusMessage(ui.feedbackFailed);
    } finally {
      setFeedbackPending(false);
    }
  };

  const closeReasonDialog = () => {
    if (feedbackPending) return;
    setReasonDialogRating(null);
    setSelectedReasonCodes([]);
    setReasonDialogError('');
  };

  const toggleReasonCode = (reasonCode: AiFeedbackReasonCode) => {
    setReasonDialogError('');
    setSelectedReasonCodes((current) => (
      current.includes(reasonCode)
        ? current.filter((code) => code !== reasonCode)
        : [...current, reasonCode]
    ));
  };

  const submitReasonCodes = async () => {
    if (!onFeedback || !reasonDialogRating || selectedReasonCodes.length === 0) return;
    setFeedbackPending(true);
    setReasonDialogError('');
    try {
      await onFeedback(reasonDialogRating, selectedReasonCodes);
      setStatusMessage(ui.feedbackSaved);
      setReasonDialogRating(null);
      setSelectedReasonCodes([]);
    } catch {
      setStatusMessage(ui.feedbackFailed);
      setReasonDialogError(ui.feedbackFailed);
    } finally {
      setFeedbackPending(false);
    }
  };

  return (
    <div className="ui-chat-message-actions">
      <button
        type="button"
        className="ui-chat-message-action"
        onClick={() => void handleCopy()}
        aria-label={copyLabel}
        title={copyLabel}
      >
        {copyState === 'copied'
          ? <CheckIcon className="h-4 w-4" aria-hidden="true" />
          : <ClipboardDocumentIcon className="h-4 w-4" aria-hidden="true" />}
      </button>
      {onFeedback ? (
        <>
          <button
            type="button"
            className={`ui-chat-message-action ${feedbackRating === 'helpful' ? 'is-selected' : ''}`}
            onClick={() => void handleFeedback('helpful')}
            disabled={feedbackPending || feedbackDisabled}
            aria-label={ui.helpful}
            aria-pressed={feedbackRating === 'helpful'}
            title={ui.helpful}
          >
            <HandThumbUpIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`ui-chat-message-action ${feedbackRating === 'unhelpful' ? 'is-selected' : ''}`}
            onClick={() => void handleFeedback('unhelpful')}
            disabled={feedbackPending || feedbackDisabled}
            aria-label={ui.unhelpful}
            aria-pressed={feedbackRating === 'unhelpful'}
            title={ui.unhelpful}
          >
            <HandThumbDownIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      ) : null}
      <span className="sr-only" role="status" aria-live="polite">{statusMessage}</span>
      <ChatFeedbackReasonDialog
        isOpen={reasonDialogRating !== null}
        rating={reasonDialogRating ?? 'helpful'}
        language={language}
        selectedReasonCodes={selectedReasonCodes}
        pending={feedbackPending}
        errorMessage={reasonDialogError}
        onToggleReason={toggleReasonCode}
        onClose={closeReasonDialog}
        onSubmit={() => void submitReasonCodes()}
      />
    </div>
  );
}
