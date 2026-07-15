const METADATA_LINE = /^\[(?:title|aliases|route|slug|locale|status)\]\s*/i;
const INTERNAL_LINE = /^(?:runtime knowledge|this locale document|status=|route=|slug=)/i;

export function buildReferenceSearchExcerpt(text: string, maxLength = 240): string {
  const cleanText = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !METADATA_LINE.test(line))
    .filter((line) => !INTERNAL_LINE.test(line))
    .map((line) => line
      .replace(/^#{1,6}\s+/, '')
      .replace(/\[[^\]\r\n]{1,40}\]\s*/g, '')
      .replace(/\\\[/g, '['))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanText.length <= maxLength) return cleanText;
  return `${cleanText.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}
