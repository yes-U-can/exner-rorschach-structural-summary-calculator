'use client';

import { useToast } from '@/components/ui/Toast';
import { getReferenceDocumentUi } from '@/lib/referenceDocumentUi';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export default function CopyDocButton({ text, language }: { text: string; language: string }) {
  const { showToast } = useToast();
  const ui = getReferenceDocumentUi(language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast({
        type: 'success',
        title: ui.copiedTitle,
        message: ui.copiedMessage,
      });
    } catch {
      showToast({
        type: 'error',
        title: ui.copyFailedTitle,
        message: ui.copyFailedMessage,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ui.copy}
      title={ui.copy}
      className="ui-copy-button gap-1 px-2.5 py-1.5 text-sm font-medium"
    >
      <DocumentDuplicateIcon className="h-4 w-4" />
      {ui.copy}
    </button>
  );
}
