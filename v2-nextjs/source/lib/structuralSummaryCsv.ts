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

const ALLOWED_SUMMARY_HEADERS = new Set([
  ...REQUIRED_SUMMARY_HEADERS,
  'W',
  'Dd',
  'S',
  'dq_plus',
  'dq_o',
  'dq_vplus',
  'dq_v',
  'pairs',
  'sum6',
  'wsum6',
  'FM',
  'm',
  'SumCprime',
  'SumT',
  'SumV',
  'SumY',
  'Afr',
  'XA_percent',
  'WDA_percent',
  'X_minus_percent',
  'S_minus',
  'P',
  'X_plus_percent',
  'Xu_percent',
  'PSV',
  'DQ_plus',
  'DQ_v',
  'W_D_Dd',
  'W_M',
  'a_p',
  'Ma_Mp',
  '_2AB_Art_Ay',
  'MOR',
  'Sum6',
  'Lv2',
  'WSum6_ideation',
  'M_minus_ideation',
  'Mnone',
  'FC_CF_C',
  'PureC',
  'SumC_WSumC',
  'S_aff',
  'Blends_R',
  'CP',
  '_3r_2_R',
  'Fr_rF',
  'SumV_self',
  'FD',
  'An_Xy',
  'MOR_self',
  'H_ratio',
  'COP',
  'AG',
  'a_p_inter',
  'Food',
  'SumT_inter',
  'HumanCont',
  'PureH',
  'PER',
  'ISO_Index',
]);

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
  if (value.length > 80) return false;
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
