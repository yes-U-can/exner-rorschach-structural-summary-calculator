'use client';

import { ArrowDownIcon } from '@heroicons/react/24/outline';

export function ChatScrollToLatestButton({
  label,
  onClick,
  streaming = false,
}: {
  label: string;
  onClick: () => void;
  streaming?: boolean;
}) {
  return (
    <button
      type="button"
      className="ui-chat-scroll-latest"
      onClick={onClick}
      aria-label={label}
      title={label}
      data-chat-scroll-indicator={streaming ? 'streaming' : 'idle'}
    >
      {streaming ? (
        <span className="ui-chat-scroll-streaming" aria-hidden="true">
          <span className="ui-chat-stream-dot" />
          <span className="ui-chat-stream-dot" />
          <span className="ui-chat-stream-dot" />
        </span>
      ) : (
        <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
