import { describe, expect, it } from 'vitest';
import type { RorschachResponse } from '@/types';
import { calculateStructuralSummary } from './calculator';
import { generateRawDataCsv, generateSummaryCsv, SUMMARY_CSV_HEADERS } from './csv';
import { validateStructuralSummaryCsv } from './structuralSummaryCsv';

const RESPONSES: RorschachResponse[] = [
  {
    card: 'I',
    response: 'bat',
    location: 'W',
    dq: 'o',
    determinants: ['F'],
    fq: 'o',
    pair: 'none',
    contents: ['A'],
    popular: true,
    z: 'ZW',
    specialScores: [],
  },
  {
    card: 'II',
    response: 'two people',
    location: 'D',
    dq: '+',
    determinants: ['FC', 'Ma'],
    fq: 'u',
    pair: '(2)',
    contents: ['H', 'Cg'],
    popular: false,
    z: 'ZA',
    specialScores: ['COP', 'DR1'],
  },
  {
    card: 'III',
    response: 'damaged figure',
    location: 'Dd',
    dq: 'v',
    determinants: ['CF', "C'F"],
    fq: '-',
    pair: 'none',
    contents: ['An', 'Art'],
    popular: false,
    z: '',
    specialScores: ['FABCOM2', 'MOR'],
  },
];

function parseCsvLine(line: string): string[] {
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
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function parseTwoLineCsv(csv: string) {
  const [headersLine, valuesLine] = csv.split('\n');
  const headers = parseCsvLine(headersLine);
  const values = parseCsvLine(valuesLine);
  return {
    headers,
    values,
    row: Object.fromEntries(headers.map((header, index) => [header, values[index]])),
  };
}

describe('summary CSV export', () => {
  it('exports a unique, validation-safe row that matches displayed structural summary fields', () => {
    const result = calculateStructuralSummary(RESPONSES);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();

    const csv = generateSummaryCsv(result.data!);
    const validation = validateStructuralSummaryCsv(csv);
    const { headers, values, row } = parseTwoLineCsv(csv);

    expect(validation.ok).toBe(true);
    expect(headers).toEqual(SUMMARY_CSV_HEADERS);
    expect(values).toHaveLength(headers.length);
    expect(new Set(headers).size).toBe(headers.length);

    expect(row.Loc_D).toBe(String(result.data!.upper_section.D));
    expect(row.D).toBe(String(result.data!.lower_section.D));
    expect(row.Blends_list).toBe("FC.Ma / CF.C'F");
    expect(row.Single_F).toBe('1');
    expect(row.Det_FC).toBe('1');
    expect(row.Content_A).toBe('1');
    expect(row.Approach_I).toBe('W');
    expect(row.SS_DR1).toBe('1');
    expect(row.SS_FABCOM2).toBe('1');
    expect(row.FQ_o_FQx).toBe('1');
    expect(row.PTI_c1).toMatch(/^[01]$/);
  });
});

describe('raw scoring CSV export', () => {
  it('exports only scoring rows that participate in the calculation', () => {
    const csv = generateRawDataCsv([
      ...RESPONSES,
      {
        card: '',
        response: 'draft without card',
        location: '',
        dq: '',
        determinants: [],
        fq: '',
        pair: 'none',
        contents: [],
        popular: false,
        z: '',
        specialScores: [],
      },
    ]);

    const lines = csv.split('\n');
    expect(lines).toHaveLength(RESPONSES.length + 1);
    expect(lines[1]).toBe('I,bat,W,o,F,o,none,A,1,ZW,');
    expect(csv).not.toContain('draft without card');
  });
});
