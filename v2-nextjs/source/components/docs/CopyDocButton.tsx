'use client';

import { useToast } from '@/components/ui/Toast';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export default function CopyDocButton({ text }: { text: string }) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast({
        type: 'success',
        title: 'Copied',
        message: 'Documentation copied to clipboard.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Copy failed',
        message: 'Could not copy text. Please copy manually.',
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ui-copy-button gap-1 px-2.5 py-1.5 text-sm font-medium"
    >
      <DocumentDuplicateIcon className="h-4 w-4" />
      Copy
    </button>
  );
}
