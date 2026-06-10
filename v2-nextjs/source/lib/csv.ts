/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RorschachResponse, StructuralSummary } from '@/types';

export function escapeCsvCell(cell: any): string {
  if (cell === null || cell === undefined) return '';
  let str = String(cell);
  const leftTrimmed = str.replace(/^[\t\r\n ]+/, '');
  if (/^[=+\-@]/.test(leftTrimmed)) {
    str = "'" + str;
  }
  str = str.replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    str = '"' + str + '"';
  }
  return str;
}

type SummaryCsvColumn = {
  header: string;
  value: (results: StructuralSummary) => string | number | null | undefined;
};

const SINGLE_DETERMINANTS = [
  'M', 'FM', 'm',
  'FC', 'CF', 'C', 'Cn',
  "FC'", "C'F", "C'",
  'FT', 'TF', 'T',
  'FV', 'VF', 'V',
  'FY', 'YF', 'Y',
  'Fr', 'rF', 'FD', 'F',
] as const;

const DETERMINANTS = [
  'M', 'FM', 'm', 'FC', 'CF', 'C', "FC'", "C'F",
  "C'", 'FV', 'VF', 'V', 'FT', 'TF', 'T', 'FD',
  'F', 'Cn', 'FY', 'YF', 'Y', 'Fr', 'rF',
] as const;

const CONTENTS = [
  'H', '(H)', 'Hd', '(Hd)', 'Hx',
  'A', '(A)', 'Ad', '(Ad)',
  'An', 'Art', 'Ay', 'Bl', 'Bt', 'Cg', 'Cl',
  'Ex', 'Fd', 'Fi', 'Ge', 'Hh', 'Ls', 'Na', 'Sc', 'Sx', 'Xy', 'Id',
] as const;

const SPECIAL_SCORE_COUNTS = [
  'DV1', 'INCOM1', 'DR1', 'FABCOM1',
  'DV2', 'INCOM2', 'DR2', 'FABCOM2',
  'ALOG', 'CONTAM', 'AB', 'AG', 'COP', 'MOR', 'CP', 'PER', 'PSV',
] as const;

const FORM_QUALITY_ROWS = [
  { key: '+', label: 'plus' },
  { key: 'o', label: 'o' },
  { key: 'u', label: 'u' },
  { key: '-', label: 'minus' },
  { key: 'none', label: 'none' },
] as const;

const CARD_ORDER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const;

function codeHeader(code: string): string {
  return code
    .replace(/\+/g, 'plus')
    .replace(/-/g, 'minus')
    .replace(/'/g, 'prime')
    .replace(/\(([^)]+)\)/g, 'paren_$1')
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function joinCodes(values: readonly string[] | undefined): string {
  if (!values || values.length === 0) return '-';
  return values.join(' / ');
}

function joinBlends(values: readonly string[][] | undefined): string {
  if (!values || values.length === 0) return '-';
  return values.map((blend) => blend.join('.')).join(' / ');
}

function flag(value: boolean | undefined): number {
  return value ? 1 : 0;
}

const CORE_SUMMARY_CSV_COLUMNS: SummaryCsvColumn[] = [
  { header: 'Zf', value: (results) => results.upper_section.Zf },
  { header: 'ZSum', value: (results) => results.upper_section.ZSum },
  { header: 'ZEst', value: (results) => results.upper_section.ZEst },
  { header: 'Zd', value: (results) => results.lower_section.Zd },
  { header: 'R', value: (results) => results.lower_section.R },
  { header: 'Lambda', value: (results) => results.lower_section.Lambda },
  { header: 'EB', value: (results) => results.lower_section.EB },
  { header: 'EA', value: (results) => results.lower_section.EA },
  { header: 'EBPer', value: (results) => results.lower_section.EBPer },
  { header: 'eb', value: (results) => results.lower_section.eb },
  { header: 'es', value: (results) => results.lower_section.es },
  { header: 'AdjEs', value: (results) => results.lower_section.AdjEs },
  { header: 'D', value: (results) => results.lower_section.D },
  { header: 'AdjD', value: (results) => results.lower_section.AdjD },
  { header: 'PTI', value: (results) => results.special_indices.PTI },
  { header: 'DEPI', value: (results) => results.special_indices.DEPI },
  { header: 'CDI', value: (results) => results.special_indices.CDI },
  { header: 'SCON', value: (results) => results.special_indices.SCON },
  { header: 'HVI', value: (results) => results.special_indices.HVI },
  { header: 'OBS', value: (results) => results.special_indices.OBS },
  { header: 'GHR', value: (results) => results.special_indices.GHR },
  { header: 'PHR', value: (results) => results.special_indices.PHR },
];

const UPPER_SUMMARY_CSV_COLUMNS: SummaryCsvColumn[] = [
  { header: 'Loc_W', value: (results) => results.upper_section.W },
  { header: 'Loc_D', value: (results) => results.upper_section.D },
  { header: 'Loc_W_plus_D', value: (results) => results.upper_section.W + results.upper_section.D },
  { header: 'Loc_Dd', value: (results) => results.upper_section.Dd },
  { header: 'Loc_S', value: (results) => results.upper_section.S },
  { header: 'dq_plus', value: (results) => results.upper_section.dq_plus },
  { header: 'dq_o', value: (results) => results.upper_section.dq_o },
  { header: 'dq_vplus', value: (results) => results.upper_section.dq_vplus },
  { header: 'dq_v', value: (results) => results.upper_section.dq_v },
  { header: 'Blends_list', value: (results) => joinBlends(results.upper_section.blends) },
  ...SINGLE_DETERMINANTS.map((code): SummaryCsvColumn => ({
    header: `Single_${codeHeader(code)}`,
    value: (results) => results.upper_section.singleDetCounts[code] || 0,
  })),
  { header: 'Pairs_2', value: (results) => results.upper_section.pairs },
  ...CONTENTS.map((code): SummaryCsvColumn => ({
    header: `Content_${codeHeader(code)}`,
    value: (results) => results.upper_section.contentCounts[code] || 0,
  })),
  ...CARD_ORDER.map((card): SummaryCsvColumn => ({
    header: `Approach_${card}`,
    value: (results) => joinCodes(results.upper_section.approachData[card]),
  })),
  ...SPECIAL_SCORE_COUNTS.map((code): SummaryCsvColumn => ({
    header: `SS_${codeHeader(code)}`,
    value: (results) => results.upper_section.specialScoreCounts[code] || 0,
  })),
  { header: 'SS_Sum6', value: (results) => results.upper_section.sum6 },
  { header: 'SS_WSum6', value: (results) => results.upper_section.wsum6 },
  ...FORM_QUALITY_ROWS.flatMap(({ key, label }) => ([
    {
      header: `FQ_${label}_FQx`,
      value: (results: StructuralSummary) => results.upper_section.formQuality[key]?.fqx || 0,
    },
    {
      header: `FQ_${label}_MQual`,
      value: (results: StructuralSummary) => results.upper_section.formQuality[key]?.mqual || 0,
    },
    {
      header: `FQ_${label}_WD`,
      value: (results: StructuralSummary) => results.upper_section.formQuality[key]?.wd || 0,
    },
  ] satisfies SummaryCsvColumn[])),
  ...DETERMINANTS.map((code): SummaryCsvColumn => ({
    header: `Det_${codeHeader(code)}`,
    value: (results) => results.upper_section.detCounts[code] || 0,
  })),
];

const LOWER_SUMMARY_CSV_COLUMNS: SummaryCsvColumn[] = [
  { header: 'FM', value: (results) => results.lower_section.FM },
  { header: 'm', value: (results) => results.lower_section.m },
  { header: 'SumCprime', value: (results) => results.lower_section.SumCprime },
  { header: 'SumT', value: (results) => results.lower_section.SumT },
  { header: 'SumV', value: (results) => results.lower_section.SumV },
  { header: 'SumY', value: (results) => results.lower_section.SumY },
  { header: 'Afr', value: (results) => results.lower_section.Afr },
  { header: 'XA_percent', value: (results) => results.lower_section.XA_percent },
  { header: 'WDA_percent', value: (results) => results.lower_section.WDA_percent },
  { header: 'X_minus_percent', value: (results) => results.lower_section.X_minus_percent },
  { header: 'S_minus', value: (results) => results.lower_section.S_minus },
  { header: 'P', value: (results) => results.lower_section.P },
  { header: 'X_plus_percent', value: (results) => results.lower_section.X_plus_percent },
  { header: 'Xu_percent', value: (results) => results.lower_section.Xu_percent },
  { header: 'PSV', value: (results) => results.lower_section.PSV },
  { header: 'DQ_plus', value: (results) => results.lower_section.DQ_plus },
  { header: 'DQ_v', value: (results) => results.lower_section.DQ_v },
  { header: 'W_D_Dd', value: (results) => results.lower_section.W_D_Dd },
  { header: 'W_M', value: (results) => results.lower_section.W_M },
  { header: 'a_p', value: (results) => results.lower_section.a_p },
  { header: 'Ma_Mp', value: (results) => results.lower_section.Ma_Mp },
  { header: '_2AB_Art_Ay', value: (results) => results.lower_section._2AB_Art_Ay },
  { header: 'MOR', value: (results) => results.lower_section.MOR },
  { header: 'Sum6', value: (results) => results.lower_section.Sum6 },
  { header: 'Lv2', value: (results) => results.lower_section.Lv2 },
  { header: 'WSum6_ideation', value: (results) => results.lower_section.WSum6_ideation },
  { header: 'M_minus_ideation', value: (results) => results.lower_section.M_minus_ideation },
  { header: 'Mnone', value: (results) => results.lower_section.Mnone },
  { header: 'FC_CF_C', value: (results) => results.lower_section.FC_CF_C },
  { header: 'PureC', value: (results) => results.lower_section.PureC },
  { header: 'SumC_WSumC', value: (results) => results.lower_section.SumC_WSumC },
  { header: 'S_aff', value: (results) => results.lower_section.S_aff },
  { header: 'Blends_R', value: (results) => results.lower_section.Blends_R },
  { header: 'CP', value: (results) => results.lower_section.CP },
  { header: '_3r_2_R', value: (results) => results.lower_section._3r_2_R },
  { header: 'Fr_rF', value: (results) => results.lower_section.Fr_rF },
  { header: 'SumV_self', value: (results) => results.lower_section.SumV_self },
  { header: 'FD', value: (results) => results.lower_section.FD },
  { header: 'An_Xy', value: (results) => results.lower_section.An_Xy },
  { header: 'MOR_self', value: (results) => results.lower_section.MOR_self },
  { header: 'H_ratio', value: (results) => results.lower_section.H_ratio },
  { header: 'COP', value: (results) => results.lower_section.COP },
  { header: 'AG', value: (results) => results.lower_section.AG },
  { header: 'a_p_inter', value: (results) => results.lower_section.a_p_inter },
  { header: 'Food', value: (results) => results.lower_section.Food },
  { header: 'SumT_inter', value: (results) => results.lower_section.SumT_inter },
  { header: 'HumanCont', value: (results) => results.lower_section.HumanCont },
  { header: 'PureH', value: (results) => results.lower_section.PureH },
  { header: 'PER', value: (results) => results.lower_section.PER },
  { header: 'ISO_Index', value: (results) => results.lower_section.ISO_Index },
];

const SPECIAL_INDEX_DETAIL_COLUMNS: SummaryCsvColumn[] = [
  ...['c1', 'c2', 'c3', 'c4', 'c5'].map((key): SummaryCsvColumn => ({
    header: `PTI_${key}`,
    value: (results) => flag(results.special_indices.pti_criteria[key]),
  })),
  ...['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'].map((key): SummaryCsvColumn => ({
    header: `DEPI_${key}`,
    value: (results) => flag(results.special_indices.depi_criteria[key]),
  })),
  ...['c1', 'c2', 'c3', 'c4', 'c5'].map((key): SummaryCsvColumn => ({
    header: `CDI_${key}`,
    value: (results) => flag(results.special_indices.cdi_criteria[key]),
  })),
  ...Array.from({ length: 12 }, (_, index): SummaryCsvColumn => {
    const key = `c${index + 1}`;
    return {
      header: `SCON_${key}`,
      value: (results) => flag(results.special_indices.scon_criteria[key]),
    };
  }),
  ...Array.from({ length: 8 }, (_, index): SummaryCsvColumn => {
    const key = `c${index + 1}`;
    return {
      header: `HVI_${key}`,
      value: (results) => flag(results.special_indices.hvi_criteria[key]),
    };
  }),
  ...Array.from({ length: 5 }, (_, index): SummaryCsvColumn => {
    const key = `c${index + 1}`;
    return {
      header: `OBS_${key}`,
      value: (results) => flag(results.special_indices.obs_criteria[key]),
    };
  }),
  ...Array.from({ length: 4 }, (_, index): SummaryCsvColumn => {
    const key = `r${index + 1}`;
    return {
      header: `OBS_${key}`,
      value: (results) => flag(results.special_indices.obs_rules[key]),
    };
  }),
];

export const SUMMARY_CSV_COLUMNS: SummaryCsvColumn[] = [
  ...CORE_SUMMARY_CSV_COLUMNS,
  ...UPPER_SUMMARY_CSV_COLUMNS,
  ...LOWER_SUMMARY_CSV_COLUMNS,
  ...SPECIAL_INDEX_DETAIL_COLUMNS,
];

export const SUMMARY_CSV_HEADERS = SUMMARY_CSV_COLUMNS.map((column) => column.header);

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateSummaryCsv(results: StructuralSummary): string {
  const headers = SUMMARY_CSV_COLUMNS.map((column) => escapeCsvCell(column.header));
  const values = SUMMARY_CSV_COLUMNS.map((column) => escapeCsvCell(column.value(results)));

  return headers.join(',') + '\n' + values.join(',');
}

export function generateRawDataCsv(responses: RorschachResponse[]): string {
  const headers = [
    'Card', 'Response', 'Location', 'DQ', 'Determinants', 'FQ', 'Pair', 'Contents', 'Popular', 'Z', 'Special Scores'
  ];

  const rows = responses.filter((r) => r.card).map(r => [
    escapeCsvCell(r.card),
    escapeCsvCell(r.response),
    escapeCsvCell(r.location),
    escapeCsvCell(r.dq),
    escapeCsvCell(r.determinants?.join(';') || ''),
    escapeCsvCell(r.fq),
    escapeCsvCell(r.pair),
    escapeCsvCell(r.contents?.join(';') || ''),
    escapeCsvCell(r.popular ? '1' : ''),
    escapeCsvCell(r.z),
    escapeCsvCell(r.specialScores?.join(';') || '')
  ]);

  return headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
}

export function exportToCSV(responses: RorschachResponse[]) {
  const csv = generateRawDataCsv(responses);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, `rorschach_rawdata_${timestamp}.csv`);
}

export function exportSummaryToCSV(results: StructuralSummary) {
  const csv = generateSummaryCsv(results);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, `rorschach_summary_${timestamp}.csv`);
}

