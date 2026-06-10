import { SUMMARY_CSV_HEADERS } from './csv';

const REQUIRED_SUMMARY_HEADERS = [
  'Zf',
  'ZSum',
  'ZEst',
  'Zd',
  'R',
  'Lambda',
  'EB',
  'EA',
  'EBPer',
  'eb',
  'es',
  'AdjEs',
  'D',
  'AdjD',
  'PTI',
  'DEPI',
  'CDI',
  'SCON',
  'HVI',
  'OBS',
  'GHR',
  'PHR',
];

const ALLOWED_SUMMARY_HEADERS = new Set(SUMMARY_CSV_HEADERS);

type StructuralSummaryCsvResult =
  | { ok: true; csv: string; headers: string[]; values: string[] }
  | { ok: false; reason: 'empty' | 'shape' | 'headers' | 'values' };

function parseCsvLine(line: string): string[] | null {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (inQuotes) return null;
  cells.push(current.trim());
  return cells;
}

function isSafeSummaryValue(value: string) {
  if (value.length > 500) return false;
  if (/[<>{}`\[\]]/.test(value)) return false;
  if (/ignore|system|prompt|assistant|developer/i.test(value)) return false;
  return /^[\p{L}\p{N}\s'.:,%_+\-/()]*$/u.test(value);
}

function escapeCsvCell(value: string) {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function validateStructuralSummaryCsv(input: string): StructuralSummaryCsvResult {
  const normalized = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
  if (!normalized) return { ok: false, reason: 'empty' };
  if (normalized.includes('```')) return { ok: false, reason: 'shape' };

  const lines = normalized.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length !== 2) return { ok: false, reason: 'shape' };

  const headers = parseCsvLine(lines[0]);
  const values = parseCsvLine(lines[1]);
  if (!headers || !values || headers.length !== values.length || headers.length < REQUIRED_SUMMARY_HEADERS.length) {
    return { ok: false, reason: 'shape' };
  }

  const headerSet = new Set(headers);
  if (
    !REQUIRED_SUMMARY_HEADERS.every((header) => headerSet.has(header)) ||
    headers.some((header) => !ALLOWED_SUMMARY_HEADERS.has(header))
  ) {
    return { ok: false, reason: 'headers' };
  }

  if (!values.every(isSafeSummaryValue)) {
    return { ok: false, reason: 'values' };
  }

  return {
    ok: true,
    csv: `${headers.join(',')}\n${values.map(escapeCsvCell).join(',')}`,
    headers,
    values,
  };
}
