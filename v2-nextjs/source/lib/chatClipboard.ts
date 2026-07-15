type ClipboardDependencies = {
  writeText?: (content: string) => Promise<void>;
  fallbackCopy?: (content: string) => boolean;
};

function fallbackCopyWithTextArea(content: string) {
  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

export async function copyChatText(
  content: string,
  dependencies: ClipboardDependencies = {},
) {
  const writeText = dependencies.writeText ?? (
    typeof navigator !== 'undefined' && navigator.clipboard?.writeText
      ? navigator.clipboard.writeText.bind(navigator.clipboard)
      : undefined
  );

  const fallbackCopy = dependencies.fallbackCopy ?? fallbackCopyWithTextArea;
  let modernCopy: Promise<void> | null = null;
  let fallbackSucceeded = false;

  // Both attempts must begin during the click's transient user activation.
  // Waiting for a denied Clipboard API promise first can make execCommand fail too.
  if (writeText) {
    try {
      modernCopy = Promise.resolve(writeText(content));
    } catch {
      modernCopy = null;
    }
  }

  try {
    fallbackSucceeded = fallbackCopy(content);
  } catch {
    fallbackSucceeded = false;
  }

  if (modernCopy) {
    try {
      await modernCopy;
      return;
    } catch {
      // The synchronous compatibility attempt may still have succeeded.
    }
  }

  if (!fallbackSucceeded) throw new Error('clipboard_copy_failed');
}
