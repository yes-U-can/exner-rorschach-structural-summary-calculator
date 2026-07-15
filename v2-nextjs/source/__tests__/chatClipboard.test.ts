import { describe, expect, it, vi } from 'vitest';
import { copyChatText } from '@/lib/chatClipboard';

describe('chat response copying', () => {
  it('starts both copy paths while the click activation is still available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const fallbackCopy = vi.fn().mockReturnValue(true);

    await copyChatText('complete response', { writeText, fallbackCopy });

    expect(writeText).toHaveBeenCalledWith('complete response');
    expect(fallbackCopy).toHaveBeenCalledWith('complete response');
  });

  it('falls back when the Clipboard API denies permission', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('permission denied'));
    const fallbackCopy = vi.fn().mockReturnValue(true);

    await copyChatText('complete response', { writeText, fallbackCopy });

    expect(fallbackCopy).toHaveBeenCalledWith('complete response');
  });

  it('reports failure only when both copy paths fail', async () => {
    await expect(copyChatText('complete response', {
      writeText: vi.fn().mockRejectedValue(new Error('permission denied')),
      fallbackCopy: vi.fn().mockReturnValue(false),
    })).rejects.toThrow('clipboard_copy_failed');
  });

  it('uses the compatibility path when the Clipboard API is unavailable', async () => {
    const fallbackCopy = vi.fn().mockReturnValue(true);

    await copyChatText('complete response', { fallbackCopy });

    expect(fallbackCopy).toHaveBeenCalledWith('complete response');
  });
});
