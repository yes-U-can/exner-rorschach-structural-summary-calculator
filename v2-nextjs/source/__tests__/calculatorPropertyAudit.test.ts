import { describe, expect, it } from 'vitest';

import { calculateStructuralSummary } from '@/lib/calculator';
import { DETERMINANT_INPUT_CODES } from '@/lib/options';
import type { RorschachResponse } from '@/types';

const CARDS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const;
const LOCATIONS = ['W', 'WS', 'D', 'DS', 'Dd', 'DdS'] as const;
const DQ = ['+', 'o', 'v/+', 'v'] as const;
const FQ = ['+', 'o', 'u', '-', 'none'] as const;
type ZCode = '' | 'ZW' | 'ZA' | 'ZD' | 'ZS';
const DETERMINANTS = DETERMINANT_INPUT_CODES;
const CONTENTS = [
  'H', '(H)', 'Hd', '(Hd)', 'Hx', 'A', '(A)', 'Ad', '(Ad)', 'An', 'Art',
  'Ay', 'Bl', 'Bt', 'Cg', 'Cl', 'Ex', 'Fd', 'Fi', 'Ge', 'Hh', 'Ls', 'Na',
  'Sc', 'Sx', 'Xy', 'Id',
] as const;
const SPECIAL_SCORES = [
  'DV1', 'DV2', 'INCOM1', 'INCOM2', 'DR1', 'DR2', 'FABCOM1', 'FABCOM2',
  'CONTAM', 'ALOG', 'PSV', 'AB', 'AG', 'COP', 'MOR', 'PER', 'CP',
] as const;
const SINGLE_SCORE_DETERMINANT_FAMILIES = [
  ['FC', 'CF', 'C'],
  ["FC'", "C'F", "C'"],
  ['FT', 'TF', 'T'],
  ['FV', 'VF', 'V'],
  ['FY', 'YF', 'Y'],
] as const;

const ZEST = [
  null, 2.5, 6, 10, 13.5, 17, 20.5, 24, 27.5, 31,
  34.5, 38, 41.5, 45.5, 49, 52.5, 56, 59.5, 63, 66.5,
  70, 73.5, 77, 81, 84.5, 88, 91.5, 95, 98.5, 102.5,
  105.5, 109.5, 112.5, 116.5, 120, 123.5, 127, 130.5, 134, 137.5,
  141, 144.5, 148, 152, 155.5, 159, 162.5, 166, 169.5, 173,
] as const;

const Z_WEIGHTS: Record<string, Record<string, number>> = {
  I: { ZW: 1, ZA: 4, ZD: 6, ZS: 3.5 },
  II: { ZW: 4.5, ZA: 3, ZD: 5.5, ZS: 4.5 },
  III: { ZW: 5.5, ZA: 3, ZD: 4, ZS: 4.5 },
  IV: { ZW: 2, ZA: 4, ZD: 3.5, ZS: 5 },
  V: { ZW: 1, ZA: 2.5, ZD: 5, ZS: 4 },
  VI: { ZW: 2.5, ZA: 2.5, ZD: 6, ZS: 6.5 },
  VII: { ZW: 2.5, ZA: 1, ZD: 3, ZS: 4 },
  VIII: { ZW: 4.5, ZA: 3, ZD: 3, ZS: 4 },
  IX: { ZW: 5.5, ZA: 2.5, ZD: 4.5, ZS: 5 },
  X: { ZW: 5.5, ZA: 4, ZD: 4.5, ZS: 6 },
};

const HUMAN_MOVEMENT = new Set(['Ma', 'Mp', 'Ma-p']);
const ANIMAL_MOVEMENT = new Set(['FMa', 'FMp', 'FMa-p']);
const INANIMATE_MOVEMENT = new Set(['ma', 'mp', 'ma-p']);
const ACTIVE_MOVEMENT = new Set(['Ma', 'Ma-p', 'FMa', 'FMa-p', 'ma', 'ma-p']);
const PASSIVE_MOVEMENT = new Set(['Mp', 'Ma-p', 'FMp', 'FMa-p', 'mp', 'ma-p']);
const GOOD_FQ = new Set(['+', 'o', 'u']);
const W_D_LOCATIONS = new Set(['W', 'WS', 'D', 'DS']);
const S_LOCATIONS = new Set(['WS', 'DS', 'DdS']);
const COGNITIVE_WEIGHTS: Record<string, number> = {
  DV1: 1, INCOM1: 2, DR1: 3, FABCOM1: 4,
  DV2: 2, INCOM2: 4, DR2: 6, FABCOM2: 7,
  ALOG: 5, CONTAM: 7,
};
const CONTAM_CONFLICTS = new Set([
  'DV1', 'DV2', 'DR1', 'DR2', 'INCOM1', 'INCOM2',
  'FABCOM1', 'FABCOM2', 'ALOG',
]);

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)];
}

function sampleDistinct<T>(random: () => number, values: readonly T[], count: number): T[] {
  const pool = [...values];
  const selected: T[] = [];
  while (selected.length < count && pool.length > 0) {
    selected.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  }
  return selected;
}

function sampleValidDeterminants(random: () => number, count: number) {
  const pool = [...DETERMINANTS];
  const selected: typeof DETERMINANTS[number][] = [];

  while (selected.length < count && pool.length > 0) {
    const candidate = pool.splice(Math.floor(random() * pool.length), 1)[0];
    const conflictsWithSelectedFamily = SINGLE_SCORE_DETERMINANT_FAMILIES.some((family) => (
      (family as readonly string[]).includes(candidate) &&
      selected.some((code) => (family as readonly string[]).includes(code))
    ));
    if (!conflictsWithSelectedFamily) selected.push(candidate);
  }

  return selected;
}

function sampleValidContents(random: () => number, count: number) {
  const selected = sampleDistinct(random, CONTENTS, count);
  const withoutNatureConflict = selected.includes('Na')
    ? selected.filter((code) => code !== 'Bt' && code !== 'Ls')
    : selected.includes('Bt')
      ? selected.filter((code) => code !== 'Ls')
      : selected;
  return withoutNatureConflict.includes('Xy')
    ? withoutNatureConflict.filter((code) => code !== 'An')
    : withoutNatureConflict;
}

function makeProtocol(random: () => number): RorschachResponse[] {
  const responseCount = 1 + Math.floor(random() * 50);
  return Array.from({ length: responseCount }, (_, index) => {
    const determinants = sampleValidDeterminants(random, 1 + Math.floor(random() * 3));
    const dq = pick(random, DQ);
    const allFormless = determinants.every((code) => ['C', "C'", 'T', 'V', 'Y', 'Cn'].includes(code));
    const allAllowNoForm = determinants.every((code) => [
      'C', "C'", 'T', 'V', 'Y', 'Cn', 'Ma', 'Mp', 'Ma-p',
    ].includes(code));
    const hasReflection = determinants.some((code) => code === 'Fr' || code === 'rF');
    const card = pick(random, CARDS);
    const location = pick(random, LOCATIONS);
    const fqCandidates = FQ.filter((code) =>
      (dq !== 'v' || code !== '+') && (allAllowNoForm || code !== 'none'),
    );
    const fq = allFormless ? 'none' : pick(random, fqCandidates);
    let specialScores = sampleDistinct(random, SPECIAL_SCORES, Math.floor(random() * 3));
    if (specialScores.includes('CONTAM')) {
      specialScores = specialScores.filter(
        (score) => score === 'CONTAM' || !CONTAM_CONFLICTS.has(score),
      );
    }
    if (
      specialScores.includes('CP') &&
      determinants.some((code) => ['FC', 'CF', 'C'].includes(code))
    ) {
      specialScores = specialScores.filter((score) => score !== 'CP');
    }

    const validZCodes: ZCode[] = [];
    if (fq !== 'none' && dq !== 'v') {
      if (location === 'W' || location === 'WS') validZCodes.push('ZW');
      if (dq === '+' || dq === 'v/+') validZCodes.push('ZA', 'ZD');
      if (location === 'WS' || location === 'DS' || location === 'DdS') validZCodes.push('ZS');
    }
    if (location !== 'W' && location !== 'WS') validZCodes.push('');
    if (location === 'W' || location === 'WS') {
      const wholeWeight = Z_WEIGHTS[card].ZW;
      for (let zIndex = validZCodes.length - 1; zIndex >= 0; zIndex -= 1) {
        const zCode = validZCodes[zIndex];
        if (zCode !== '' && Z_WEIGHTS[card][zCode] < wholeWeight) {
          validZCodes.splice(zIndex, 1);
        }
      }
    }
    if (validZCodes.length === 0) validZCodes.push('');

    return {
      card,
      response: `seeded-response-${index + 1}`,
      location,
      dq,
      determinants,
      fq,
      pair: !hasReflection && random() < 0.2 ? '(2)' : '',
      contents: sampleValidContents(random, 1 + Math.floor(random() * 3)),
      popular: random() < 0.25,
      z: pick(random, validZCodes),
      specialScores,
    };
  });
}

function fixed1(value: number) {
  return value.toFixed(1);
}

function fixed2(value: number) {
  return value.toFixed(2);
}

function countCode(
  protocol: RorschachResponse[],
  field: 'determinants' | 'contents' | 'specialScores',
  code: string,
) {
  return protocol.reduce(
    (total, response) => total + response[field].filter((value) => value === code).length,
    0,
  );
}

function countSet(protocol: RorschachResponse[], codes: Set<string>) {
  return protocol.reduce(
    (total, response) => total + response.determinants.filter((code) => codes.has(code)).length,
    0,
  );
}

function expectedD(value: number) {
  if (value >= -2.5 && value <= 2.5) return 0;
  return value > 2.5
    ? Math.ceil((value - 2.5) / 2.5)
    : -Math.ceil((Math.abs(value) - 2.5) / 2.5);
}

function auditExpected(protocol: RorschachResponse[]) {
  const R = protocol.length;
  const M = countSet(protocol, HUMAN_MOVEMENT);
  const FM = countSet(protocol, ANIMAL_MOVEMENT);
  const m = countSet(protocol, INANIMATE_MOVEMENT);
  const FC = countCode(protocol, 'determinants', 'FC');
  const CF = countCode(protocol, 'determinants', 'CF');
  const C = countCode(protocol, 'determinants', 'C');
  const Cn = countCode(protocol, 'determinants', 'Cn');
  const WSumC = (0.5 * FC) + CF + (1.5 * C);
  const sumByFragment = (fragment: string) => protocol.reduce(
    (total, response) => total + response.determinants.filter((code) => code.includes(fragment)).length,
    0,
  );
  const SumCprime = sumByFragment("C'");
  const SumT = sumByFragment('T');
  const SumV = sumByFragment('V');
  const SumY = sumByFragment('Y');
  const SumShading = SumCprime + SumT + SumV + SumY;
  const EA = M + WSumC;
  const esLeft = FM + m;
  const es = esLeft + SumShading;
  const AdjEs = es - Math.max(0, m - 1) - Math.max(0, SumY - 1);
  const pureF = protocol.filter((response) => (
    response.determinants.length === 1 && response.determinants[0] === 'F'
  )).length;
  const lambda = R === pureF ? null : pureF / (R - pureF);
  const ebDifference = Math.abs(M - WSumC);
  const ebRequiredDifference = EA <= 10 ? 2 : 2.5;
  const EBPer = (
    EA >= 4 && lambda !== null && lambda < 1 && M > 0 && WSumC > 0 &&
    ebDifference >= ebRequiredDifference
  ) ? fixed2(Math.max(M, WSumC) / Math.min(M, WSumC)) : '-';

  const fqCounts = Object.fromEntries(FQ.map((fq) => [
    fq,
    protocol.filter((response) => response.fq === fq).length,
  ])) as Record<string, number>;
  const XA = (fqCounts['+'] + fqCounts.o + fqCounts.u) / R;
  const XPlus = (fqCounts['+'] + fqCounts.o) / R;
  const XMinus = fqCounts['-'] / R;
  const Xu = fqCounts.u / R;
  const wd = protocol.filter((response) => W_D_LOCATIONS.has(response.location));
  const WDA = wd.length === 0
    ? null
    : wd.filter((response) => GOOD_FQ.has(response.fq)).length / wd.length;
  const lastThree = protocol.filter((response) => ['VIII', 'IX', 'X'].includes(response.card)).length;
  const firstSeven = R - lastThree;
  const Afr = firstSeven === 0 ? null : lastThree / firstSeven;

  const zResponses = protocol.filter((response) => response.z.length > 0);
  const Zf = zResponses.length;
  const ZSum = zResponses.reduce(
    (total, response) => total + Z_WEIGHTS[response.card][response.z],
    0,
  );
  const ZEst = Zf >= 1 && Zf <= ZEST.length ? ZEST[Zf - 1] : null;
  const Zd = typeof ZEst === 'number' ? ZSum - ZEst : null;

  const countLocation = (locations: readonly string[]) => protocol.filter(
    (response) => locations.includes(response.location),
  ).length;
  const W = countLocation(['W', 'WS']);
  const D = countLocation(['D', 'DS']);
  const Dd = countLocation(['Dd', 'DdS']);
  const S = countLocation(['WS', 'DS', 'DdS']);
  const P = protocol.filter((response) => response.popular).length;
  const SMinus = protocol.filter((response) => (
    S_LOCATIONS.has(response.location) && response.fq === '-'
  )).length;
  const blends = protocol.filter((response) => response.determinants.length > 1).length;
  const colorShadingBlends = protocol.filter((response) => (
    response.determinants.length > 1 &&
    response.determinants.some((code) => ['FC', 'CF', 'C'].includes(code)) &&
    response.determinants.some((code) => ["C'", 'T', 'V', 'Y'].some((part) => code.includes(part)))
  )).length;
  const pairs = protocol.filter((response) => response.pair === '(2)').length;
  const Fr = countCode(protocol, 'determinants', 'Fr');
  const rF = countCode(protocol, 'determinants', 'rF');
  const ego = ((3 * (Fr + rF)) + pairs) / R;

  const contentCount = (code: string) => countCode(protocol, 'contents', code);
  const Bt = contentCount('Bt');
  const Cl = contentCount('Cl');
  const Ge = contentCount('Ge');
  const Ls = contentCount('Ls');
  const Na = contentCount('Na');
  const isolate = (Bt + (2 * Cl) + Ge + Ls + (2 * Na)) / R;
  const PureH = contentCount('H');
  const HumanCont = ['H', '(H)', 'Hd', '(Hd)'].reduce((sum, code) => sum + contentCount(code), 0);
  const active = countSet(protocol, ACTIVE_MOVEMENT);
  const passive = countSet(protocol, PASSIVE_MOVEMENT);
  const Ma = countCode(protocol, 'determinants', 'Ma') + countCode(protocol, 'determinants', 'Ma-p');
  const Mp = countCode(protocol, 'determinants', 'Mp') + countCode(protocol, 'determinants', 'Ma-p');

  const specialCount = (code: string) => countCode(protocol, 'specialScores', code);
  const sum6 = Object.keys(COGNITIVE_WEIGHTS).reduce((sum, code) => sum + specialCount(code), 0);
  const WSum6 = Object.entries(COGNITIVE_WEIGHTS).reduce(
    (sum, [code, weight]) => sum + (specialCount(code) * weight),
    0,
  );
  const Level2 = ['DV2', 'INCOM2', 'DR2', 'FABCOM2'].reduce(
    (sum, code) => sum + specialCount(code),
    0,
  );
  const MMinus = protocol.reduce((total, response) => (
    total + (response.fq === '-'
      ? response.determinants.filter((code) => HUMAN_MOVEMENT.has(code)).length
      : 0)
  ), 0);
  const FV = countCode(protocol, 'determinants', 'FV');
  const VF = countCode(protocol, 'determinants', 'VF');
  const vista = countCode(protocol, 'determinants', 'V');
  const FD = countCode(protocol, 'determinants', 'FD');
  const COP = specialCount('COP');
  const AG = specialCount('AG');
  const MOR = specialCount('MOR');
  const AB = specialCount('AB');
  const Art = contentCount('Art');
  const Ay = contentCount('Ay');
  const Food = contentCount('Fd');
  const Cg = contentCount('Cg');

  const PTI = {
    c1: WDA !== null && XA < 0.70 && WDA < 0.75,
    c2: XMinus > 0.29,
    c3: Level2 > 2 && specialCount('FABCOM2') > 0,
    c4: (R < 17 && WSum6 > 12) || (R > 16 && WSum6 > 17),
    c5: MMinus > 1 || XMinus > 0.40,
  };
  const DEPI = {
    c1: (FV + VF + vista) > 0 || FD > 2,
    c2: colorShadingBlends > 0 || S > 2,
    c3: (ego > 0.44 && (Fr + rF) === 0) || ego < 0.33,
    c4: (Afr !== null && Afr < 0.46) || blends < 4,
    c5: SumShading > (FM + m) || SumCprime > 2,
    c6: MOR > 2 || ((2 * AB) + Art + Ay) > 3,
    c7: COP < 2 || isolate > 0.24,
  };
  const CDI = {
    c1: EA < 6 || expectedD(EA - AdjEs) < 0,
    c2: COP < 2 && AG < 2,
    c3: WSumC < 2.5 || (Afr !== null && Afr < 0.46),
    c4: passive > active + 1 || PureH < 2,
    c5: SumT > 1 || isolate > 0.24 || Food > 0,
  };
  const SCON = {
    c1: (FV + VF + vista + FD) > 2,
    c2: colorShadingBlends > 0,
    c3: ego < 0.31 || ego > 0.44,
    c4: MOR > 3,
    c5: Zd !== null && (Zd < -3.5 || Zd > 3.5),
    c6: es > EA,
    c7: (CF + C) > FC,
    c8: XPlus < 0.70,
    c9: S > 3,
    c10: P < 3 || P > 8,
    c11: PureH < 2,
    c12: R < 17,
  };
  const HVI = {
    c1: SumT === 0,
    c2: Zf > 12,
    c3: Zd !== null && Zd > 3.5,
    c4: S > 3,
    c5: HumanCont > 6,
    c6: ['(H)', '(A)', '(Hd)', '(Ad)'].reduce((sum, code) => sum + contentCount(code), 0) > 3,
    c7: (contentCount('Hd') + contentCount('Ad')) > 0 &&
      ((contentCount('H') + contentCount('A')) / (contentCount('Hd') + contentCount('Ad'))) < 4,
    c8: Cg > 3,
  };
  const OBS = {
    c1: Dd > 3,
    c2: Zf > 12,
    c3: Zd !== null && Zd > 3,
    c4: P > 7,
    c5: fqCounts['+'] > 1,
  };

  return {
    upper: {
      Zf,
      ZSum: fixed1(ZSum),
      ZEst: ZEst === null ? '-' : fixed1(ZEst),
      Zd: Zd === null ? '-' : fixed1(Zd),
      W,
      D,
      Dd,
      S,
      dq_plus: protocol.filter((response) => response.dq === '+').length,
      dq_o: protocol.filter((response) => response.dq === 'o').length,
      dq_vplus: protocol.filter((response) => response.dq === 'v/+').length,
      dq_v: protocol.filter((response) => response.dq === 'v').length,
      pairs,
      sum6,
      wsum6: WSum6,
    },
    lower: {
      R,
      Lambda: lambda === null ? '∞' : fixed2(lambda),
      EB: `${M}:${fixed1(WSumC)}`,
      EA: fixed1(EA),
      EBPer,
      eb: `${esLeft}:${SumShading}`,
      es: fixed1(es),
      AdjEs: fixed1(AdjEs),
      D: expectedD(EA - es),
      AdjD: expectedD(EA - AdjEs),
      FM,
      m,
      SumCprime,
      SumT,
      SumV,
      SumY,
      Afr: Afr === null ? '-' : fixed2(Afr),
      XA_percent: fixed2(XA),
      WDA_percent: WDA === null ? '-' : fixed2(WDA),
      X_minus_percent: fixed2(XMinus),
      S_minus: SMinus,
      P,
      X_plus_percent: fixed2(XPlus),
      Xu_percent: fixed2(Xu),
      a_p: `${active} : ${passive}`,
      Ma_Mp: `${Ma} : ${Mp}`,
      FC_CF_C: `${FC} : ${CF + C + Cn}`,
      _3r_2_R: fixed2(ego),
      ISO_Index: fixed2(isolate),
    },
    indices: { PTI, DEPI, CDI, SCON, HVI, OBS },
  };
}

describe('seeded independent calculation audit', () => {
  it('matches 2,000 reproducible synthetic protocols and exercises both sides of every index criterion', () => {
    const random = createRandom(0x5eed_c0de);
    const observedBranches = new Map<string, Set<boolean>>();

    for (let caseIndex = 0; caseIndex < 2_000; caseIndex += 1) {
      const protocol = makeProtocol(random);
      const expected = auditExpected(protocol);
      const result = calculateStructuralSummary(protocol);

      Object.entries(expected.indices).forEach(([indexName, criteria]) => {
        Object.entries(criteria).forEach(([criterionName, value]) => {
          const key = `${indexName}.${criterionName}`;
          const observed = observedBranches.get(key) ?? new Set<boolean>();
          observed.add(value);
          observedBranches.set(key, observed);
        });
      });

      expect(result.success, `case ${caseIndex}`).toBe(true);
      expect(result.data?.upper_section, `upper case ${caseIndex}`).toMatchObject(expected.upper);
      expect(result.data?.lower_section, `lower case ${caseIndex}`).toMatchObject(expected.lower);
      expect(result.data?.special_indices.pti_criteria, `PTI case ${caseIndex}`).toEqual(expected.indices.PTI);
      expect(result.data?.special_indices.depi_criteria, `DEPI case ${caseIndex}`).toEqual(expected.indices.DEPI);
      expect(result.data?.special_indices.cdi_criteria, `CDI case ${caseIndex}`).toEqual(expected.indices.CDI);
      expect(result.data?.special_indices.scon_criteria, `S-CON case ${caseIndex}`).toEqual(expected.indices.SCON);
      expect(result.data?.special_indices.hvi_criteria, `HVI case ${caseIndex}`).toEqual(expected.indices.HVI);
      expect(result.data?.special_indices.obs_criteria, `OBS case ${caseIndex}`).toEqual(expected.indices.OBS);
    }

    expect([...observedBranches.entries()]).toSatisfy((entries: Array<[string, Set<boolean>]>) => (
      entries.length === 42 && entries.every(([, values]) => values.has(false) && values.has(true))
    ));
  });
});
