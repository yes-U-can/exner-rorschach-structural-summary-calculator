'use client';

import { ArrowDownIcon } from '@heroicons/react/24/outline';

export function ChatScrollToLatestButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="ui-chat-scroll-latest"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
