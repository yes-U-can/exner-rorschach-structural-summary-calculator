/**
 * =================================================================================
 * 로샤 구조 요약지 계산 프로그램 (Computing Program for Rorschach Structural Summary)
 * =================================================================================
 *
 * 본 스크립트는 서울임상심리연구소(SICP)에 의해 개발되었습니다.
 * 저작권은 서울임상심리연구소에 귀속되어 있으나, 임상심리학 분야의 발전과
 * 전문가들의 원활한 업무를 돕기 위한 공익적 목적으로 본 코드를 공개합니다.
 *
 * This script was developed by the Seoul Institute of Clinical Psychology (SICP).
 * While the copyright is owned by SICP, this code is released for the public good
 * to contribute to the advancement of clinical psychology and to assist professionals.
 *
 * ---------------------------------------------------------------------------------
 *
 * MIT License
 * Copyright (c) 2025 서울임상심리연구소 (Seoul Institute of Clinical Psychology, SICP)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---------------------------------------------------------------------------------
 * @author      서울임상심리연구소 (SICP)
 * @address     서울시 종로구 숭인동 1245번지 3층
 * @created     2025-10
 * @version     v1.0.3
 * =================================================================================
 */


const SCORING_CONFIG = {
  
  /**
   * 1. 코드 그룹 정의 (중복 정의 및 하드코딩 제거)
   */
  CODES: {
    // 결정인(Determinants) 그룹
    HUMAN_MOVEMENT:     ['M', 'Ma', 'Mp', 'Ma-p'],
    ANIMAL_MOVEMENT:    ['FM', 'FMa', 'FMp', 'FMa-p'],
    INANIMATE_MOVEMENT: ['m', 'ma', 'mp', 'ma-p'],
    
    CHROMATIC_COLOR:    ['FC', 'CF', 'C'],
    ACHROMATIC_COLOR:   ["C'"],
    SHADING_TEXTURE:    ['T'],
    SHADING_VISTA:      ['V'],
    SHADING_DIFFUSE:    ['Y'],
    // 82행 isShadingDet의 'contains' 로직 기준
    SHADING_ALL_CONTAINS: ["C'", 'T', 'V', 'Y'], 
    
    MOVEMENT_ACTIVE:    ['Ma', 'FMa', 'ma'],
    MOVEMENT_PASSIVE:   ['Mp', 'FMp', 'mp'],

    // 위치(Location) 그룹
    LOCATION_W:     ['W', 'WS'],
    LOCATION_D:     ['D', 'DS'],
    LOCATION_Dd:    ['Dd', 'DdS'],
    LOCATION_S:     ['S', 'WS', 'DS', 'DdS'],
    LOCATION_WD:    ['W', 'WS', 'D', 'DS'],

    // 내용(Contents) 그룹
    HUMAN_CONTENT_GPHR: ["H", "(H)", "Hd", "(Hd)", "Hx"],
    HUMAN_CONTENT_ALL:  ['H', '(H)', 'Hd', '(Hd)'],
    PURE_H:             ['H'],

    // 특수 점수(Special Scores) 그룹
    LEVEL_2_SS:     ['DV2', 'INCOM2', 'DR2', 'FABCOM2', 'ALOG', 'CONTAM'],
    COGNITIVE_SS_BAD: ['DR1', 'DR2', 'INCOM1', 'INCOM2', 'FABCOM1', 'FABCOM2', 'ALOG', 'CONTAM'],
    AG_OR_MOR:      ['AG', 'MOR'],
    COP_OR_AG:      ['COP', 'AG'],

    // GPHR 분류용
    FQ_GOOD:        ['+', 'o', 'u'],
    FQ_BAD:         ['-', 'none'],
    GPHR_POPULAR_CARDS: ['III', 'IV', 'VII', 'IX'],

    // 전체 목록 (집계용)
    ALL_DETERMINANTS: ["C","C'","CF","C'F","Cn","F","FC","FC'","FD","FM","FMa","FMa-p","FMp","FT","FV","FY","Fr","M","Ma","Ma-p","Mp","T","TF","V","VF","Y","YF","m","ma","ma-p","mp","rF"],
    DETERMINANTS_SINGLE: ["M", "FM", "m", "FC", "CF", "C", "Cn", "FC'", "C'F", "C'", "FT", "TF", "T", "FV", "VF", "V", "FY", "YF", "Y", "Fr", "rF", "FD", "F"],
    ALL_CONTENTS: ["H", "(H)", "Hd", "(Hd)", "Hx", "A", "(A)", "Ad", "(Ad)", "An", "Art", "Ay", "Bl", "Bt", "Cg", "Cl", "Ex", "Fd", "Fi", "Ge", "Hh", "Ls", "Na", "Sc", "Sx", "Xy", "Id"],
  },

  /**
   * 2. 가중치 및 테이블 (하드코딩된 테이블 제거)
   */
  TABLES: {
    // ZEst (12행)
    ZEST: [
      null,   2.5,   6.0,  10.0,  13.5,  17.0,  20.5,  24.0,  27.5,  31.0,
      34.5,  38.0,  41.5,  45.5,  49.0,  52.5,  56.0,  59.5,  63.0,  66.5,
      70.0,  73.5,  77.0,  81.0,  84.5,  88.0,  91.5,  95.0,  98.5, 102.5,
      105.5, 109.5, 112.5, 116.5, 120.0, 123.5, 127.0, 130.5, 134.0, 137.5,
      141.0, 144.5, 148.0, 152.0, 155.5, 159.0, 162.5, 166.0, 169.5, 173.0
    ],
    // Z_SCORE_TABLE (29행)
    Z_SCORE: {
        "I":   {"ZW": 1.0, "ZA": 4.0, "ZD": 6.0, "ZS": 3.5},
        "II":  {"ZW": 4.5, "ZA": 3.0, "ZD": 5.5, "ZS": 4.5},
        "III": {"ZW": 5.5, "ZA": 3.0, "ZD": 4.0, "ZS": 4.5},
        "IV":  {"ZW": 2.0, "ZA": 4.0, "ZD": 3.5, "ZS": 5.0},
        "V":   {"ZW": 1.0, "ZA": 2.5, "ZD": 5.0, "ZS": 4.0},
        "VI":  {"ZW": 2.5, "ZA": 2.5, "ZD": 6.0, "ZS": 6.5},
        "VII": {"ZW": 2.5, "ZA": 1.0, "ZD": 3.0, "ZS": 4.0},
        "VIII":{"ZW": 4.5, "ZA": 3.0, "ZD": 3.0, "ZS": 4.0},
        "IX":  {"ZW": 5.5, "ZA": 2.5, "ZD": 4.5, "ZS": 5.0},
        "X":   {"ZW": 5.5, "ZA": 4.0, "ZD": 4.5, "ZS": 6.0}
    },
    // WSum6_weights (93행)
    WSUM6_WEIGHTS: { 
      DV1: 1, INCOM1: 2, DR1: 3, FABCOM1: 4, 
      DV2: 2, INCOM2: 4, DR2: 6, FABCOM2: 7, 
      ALOG: 5, CONTAM: 7 
    }
  },

  /**
   * 3. 특수 지표 기준치 (매직 넘버 제거)
   */
  CRITERIA: {
    // D Table (13-16행)
    D_TABLE: {
      MIN: -15,
      MAX: 15,
      DIVISOR: 2.5,
      OFFSET: 0.25
    },
    // WSumC (41행)
    WSUMC: {
      FC_WEIGHT: 0.5,
      CF_WEIGHT: 1.0,
      C_WEIGHT: 1.5
    },
    // EBPer (48-50행)
    EBPER: {
      RATIO_THRESHOLD: 2.5,
      EA_THRESHOLD: 4.0,
      DIV_BY_ZERO_FALLBACK: 0.0001
    },
    // PTI (102행)
    PTI: {
      C1_XA_PERCENT: 0.70,
      C1_WDA_PERCENT: 0.75,
      C2_X_MINUS_PERCENT: 0.29,
      C3_LEVEL2_COUNT: 2,
      C3_FABCOM2_COUNT: 0,
      C4_R_LOW: 17,
      C4_WSUM6_LOW: 12,
      C4_R_HIGH: 16, // (R > 16)
      C4_WSUM6_HIGH: 17,
      C5_M_MINUS: 1,
      C5_X_MINUS_PERCENT: 0.40
    },
    // DEPI (104-106행)
    DEPI: {
      C1_V_COUNT: 0,
      C1_FD_COUNT: 2,
      C2_COLOR_SHADING_BLENDS: 0,
      C2_S_COUNT: 2,
      C3_EGO_MAX: 0.44,
      C3_EGO_NO_REF: 0,
      C3_EGO_MIN: 0.33,
      C4_AFR: 0.46,
      C4_BLENDS: 4,
      C5_SUM_C_PRIME: 2,
      C6_MOR: 2,
      C6_INTELLECT: 3, // (2 * AB + Art + Ay)
      C7_COP: 2,
      C7_ISOLATE: 0.24,
      SCORE_THRESHOLD: 5
    },
    // CDI (107-108행)
    CDI: {
      C1_EA: 6,
      C1_ADJ_D: 0,
      C2_COP: 2,
      C2_AG: 2,
      C3_WSUMC: 2.5,
      C3_AFR: 0.46,
      C4_PASSIVE_RATIO: 1,
      C4_PURE_H: 2,
      C5_SUM_T: 1,
      C5_ISOLATE: 0.24,
      C5_FOOD: 0,
      SCORE_THRESHOLD: 4
    },
    // S-CON (109-112행)
    SCON: {
      C1_VISTA_FD: 2,
      C2_COLOR_SHADING_BLENDS: 0,
      C3_EGO_MIN: 0.31,
      C3_EGO_MAX: 0.44,
      C4_MOR: 3,
      C5_ZD_MIN: -3.5,
      C5_ZD_MAX: 3.5,
      C7_FC_RATIO: 1, // (CF + C) > FC
      C8_X_PLUS_PERCENT: 0.70,
      C9_S: 3,
      C10_P_MIN: 3,
      C10_P_MAX: 8,
      C11_PURE_H: 2,
      C12_R: 17,
      SCORE_THRESHOLD: 8
    },
    // HVI (113-117행)
    HVI: {
      C1_SUM_T: 0,
      C2_ZF: 12,
      C3_ZD: 3.0,
      C4_S: 3,
      C5_HUMAN_CONT: 6,
      C6_PAREN_CONT: 3,
      C7_H_HD_RATIO: 4.0,
      C8_CG: 3,
      SUB_SCORE_THRESHOLD: 4
    },
    // OBS (118-120행)
    OBS: {
      C1_DD: 3,
      C2_ZF: 12,
      C3_ZD: 3.0,
      C4_P: 7,
      C5_FQ_PLUS: 1,
      R2_CRITERIA_COUNT: 2,
      R2_FQ_PLUS_COUNT: 3,
      R3_CRITERIA_COUNT: 3,
      R3_X_PLUS_PERCENT: 0.89,
      R4_FQ_PLUS_COUNT: 3,
      R4_X_PLUS_PERCENT: 0.89
    }
  },

  /**
   * 4. 기타 설정
   */
  DEFAULTS: {
    CARD_ORDER: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
    FQ_TYPES: ['+', 'o', 'u', '-', 'none']
  }
};


/* =========================
 * 웹앱 진입점
 * ========================= */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index.html')
    .setTitle('Rorschach Scoring')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/* =========================
 * ZEst 테이블 (CONFIG 참조)
 * ========================= */
function zestFromZf(zf) {
  if (typeof zf !== 'number' || !Number.isFinite(zf)) return null;
  // Zf=1은 index 0 (null)을 반환. 테이블은 index 1 (zf=2)부터 시작.
  if (zf < 1 || zf >= SCORING_CONFIG.TABLES.ZEST.length) return null; 
  return SCORING_CONFIG.TABLES.ZEST[zf - 1];
}

/* =========================
 * D 테이블 (CONFIG 참조)
 * ========================= */
function dTable(x) {
  const { MIN, MAX, DIVISOR, OFFSET } = SCORING_CONFIG.CRITERIA.D_TABLE;
  if (x < MIN) return -5;
  if (x > MAX) return 5;
  if (typeof x !== 'number' || !Number.isFinite(x)) return '-'; 
  if (x >= 0) return Math.trunc((x - OFFSET) / DIVISOR);
  return -Math.trunc(((-x) - OFFSET) / DIVISOR);
}


/* =========================
 * 유틸
 * ========================= */
function val(x) { if (x === null || x === undefined) return ''; const t = String(x).trim(); return t === '' ? '' : t; }
function fix1(n) { return Number(n).toFixed(1); }
function fix2(n) { return Number(n).toFixed(2); }


/* =================================================================
 *
 * 메인 계산 함수 (REFACTORED)
 * (모든 로직은 SCORING_CONFIG를 참조)
 *
 * ================================================================= */
function calculateRorschach(formData) {
  try {
    // -----------------------------
    // 1) 입력 파싱
    // -----------------------------
    const responses = [];
    for (let i = 1; i <= 20; i++) {
      const row = {
        card:           val(formData[`card${i}`]),
        location:       val(formData[`location${i}`]),
        dq:             val(formData[`dq${i}`]),
        determinants: [],
        fq:             val(formData[`fq${i}`]),
        contents:       [],
        special_scores: [],
        z:              val(formData[`z${i}`]),
        pair:           val(formData[`pair${i}`]),
        popular:        !!formData[`pop${i}`]
      };
      for (let j = 1; j <= 6; j++) {
        const d = val(formData[`det${i}_${j}`]);
        const c = val(formData[`con${i}_${j}`]);
        const s = val(formData[`ss${i}_${j}`]);
        if (d) row.determinants.push(d);
        if (c) row.contents.push(c);
        if (s) row.special_scores.push(s);
      }
      if (row.card) responses.push(row);
    }

    const validResponses = responses;
    const R = validResponses.length;
    if (R === 0) return { success: false, error: 'No responses entered.' };

    // -----------------------------
    // 2) 헬퍼 계수기 (수정 없음)
    // -----------------------------
    const exactCountInRow = (row, tok, field = 'determinants') =>
      (Array.isArray(row[field]) ? row[field].filter(x => x === tok).length : 0);
    const exactCount = (tok, field='determinants') =>
      validResponses.reduce((a, r) => a + exactCountInRow(r, tok, field), 0);
    const countContainsAnyInRow = (row, subs, field='determinants') =>
      (Array.isArray(row[field]) ? row[field].filter(x => subs.some(s => String(x).includes(s))).length : 0);
    const countContainsAny = (subs, field='determinants') =>
      validResponses.reduce((a, r) => a + countContainsAnyInRow(r, subs, field), 0);
    const countLoc = (vals) => validResponses.filter(r => vals.includes(r.location)).length;

    // -----------------------------
    // 3) Zf / ZSum / ZEst / Zd (CONFIG 참조)
    // -----------------------------
    // (Z_SCORE_TABLE [29행]이 SCORING_CONFIG.TABLES.Z_SCORE로 이동됨)
    const Zf = validResponses.filter(r => r.z).length;
    const ZSum = validResponses.reduce((acc, r) => {
        const Z_TABLE = SCORING_CONFIG.TABLES.Z_SCORE;
        if (r.card && r.z && Z_TABLE[r.card] && Z_TABLE[r.card][r.z]) {
            return acc + Z_TABLE[r.card][r.z];
        }
        return acc;
    }, 0);
    const _ZEst = zestFromZf(Zf);
    const ZEst  = (_ZEst === null ? '-' : _ZEst);
    const Zd    = (typeof ZEst === 'number') ? (ZSum - ZEst) : '-';

    // -----------------------------
    // 4) Location 집계 (CONFIG 참조)
    // -----------------------------
    const W     = countLoc(SCORING_CONFIG.CODES.LOCATION_W);
    const D_loc = countLoc(SCORING_CONFIG.CODES.LOCATION_D);
    const Dd    = countLoc(SCORING_CONFIG.CODES.LOCATION_Dd);
    const S     = countLoc(SCORING_CONFIG.CODES.LOCATION_S);

    // -----------------------------
    // 5) 결정자 / 색채 / 셰이딩 (CONFIG 참조)
    // -----------------------------
    
    // [수정] M_total (38행) : 요청하신대로 'exactCount의 합계' 로직 유지 (CONFIG 참조)
    const M_total = SCORING_CONFIG.CODES.HUMAN_MOVEMENT
        .reduce((sum, code) => sum + exactCount(code), 0);
    const FM_total = SCORING_CONFIG.CODES.ANIMAL_MOVEMENT
        .reduce((sum, code) => sum + exactCount(code), 0);
    const m_total = SCORING_CONFIG.CODES.INANIMATE_MOVEMENT
        .reduce((sum, code) => sum + exactCount(code), 0);

    // [수정] FC, CF, C (40행) : WSumC 계산을 위해 개별 값은 유지
    const FC  = exactCount('FC');
    const CF  = exactCount('CF');
    const C   = exactCount('C');
    
    // [수정] WSumC (41행) : 가중치를 CONFIG에서 참조
    const { FC_WEIGHT, CF_WEIGHT, C_WEIGHT } = SCORING_CONFIG.CRITERIA.WSUMC;
    const WSumC = (FC_WEIGHT * FC) + (CF_WEIGHT * CF) + (C_WEIGHT * C);

    // [수정] Shading (41-43행) : 'countContainsAny'와 CONFIG 참조
    const SumCprime = countContainsAny(SCORING_CONFIG.CODES.ACHROMATIC_COLOR);
    const SumT      = countContainsAny(SCORING_CONFIG.CODES.SHADING_TEXTURE);
    const SumV      = countContainsAny(SCORING_CONFIG.CODES.SHADING_VISTA);
    const SumY      = countContainsAny(SCORING_CONFIG.CODES.SHADING_DIFFUSE);
    const SumShadingAll = SumCprime + SumT + SumV + SumY;
    
    // -----------------------------
    // 6) EA / es / Adj es / D / Adj D (CONFIG 참조)
    // -----------------------------
    const EA    = M_total + WSumC;
    const es_left = FM_total + m_total;
    const es    = es_left + SumShadingAll;
    const AdjEs = es - Math.max(0, m_total - 1) - Math.max(0, SumY - 1);
    const D_bucket    = dTable(EA - es);
    const AdjD_bucket = dTable(EA - AdjEs);
    
    let EBPer = '-';
    // [수정] EBPer (48-50행) : 매직 넘버를 CONFIG에서 참조
    const { RATIO_THRESHOLD, EA_THRESHOLD, DIV_BY_ZERO_FALLBACK } = SCORING_CONFIG.CRITERIA.EBPER;
    if (M_total > 0 || WSumC > 0) {
      if (M_total / (WSumC || 1) > RATIO_THRESHOLD && EA >= EA_THRESHOLD ) {
          EBPer = M_total / (WSumC || DIV_BY_ZERO_FALLBACK);
      } else if (WSumC / (M_total || 1) > RATIO_THRESHOLD && EA >= EA_THRESHOLD) {
          EBPer = WSumC / (M_total || DIV_BY_ZERO_FALLBACK);
      }
      if (typeof EBPer === 'number') {
        EBPer = fix2(EBPer);
      }
    }
    
    // -----------------------------
    // 7) Lambda (수정 없음)
    // -----------------------------
    const F_pure = validResponses.filter(r =>
      r.determinants.length === 1 &&
      r.determinants[0] === 'F'
    ).length;
    const Lambda = (R - F_pure) !== 0 ? (F_pure / (R - F_pure)) : 0;
    
    // -----------------------------
    // 8) Afr, X%, WDA%, X-%, S-% (CONFIG 참조)
    // -----------------------------
    const fq_plus_count = validResponses.filter(r => r.fq === '+').length;
    const fq_o_count = validResponses.filter(r => r.fq === 'o').length;
    const fq_u_count = validResponses.filter(r => r.fq === 'u').length;
    const fq_minus_count = validResponses.filter(r => r.fq === '-').length;

    const XA_percent = R > 0 ?
      ((fq_plus_count + fq_o_count + fq_u_count) / R) : 0;
    const X_plus_percent = R > 0 ?
      ((fq_plus_count + fq_o_count) / R) : 0;
    const Xu_percent = R > 0 ? (fq_u_count / R) : 0;
    const X_minus_percent = R > 0 ? (fq_minus_count / R) : 0;
    
    // [수정] WD_resps (59행) : CONFIG 참조
    const WD_resps = validResponses.filter(r => SCORING_CONFIG.CODES.LOCATION_WD.includes(r.location));
    const W_plus_D = WD_resps.length;
    const W_plus_D_good_fq = WD_resps.filter(r => SCORING_CONFIG.CODES.FQ_GOOD.includes(r.fq)).length;
    const WDA_percent = W_plus_D > 0 ? (W_plus_D_good_fq / W_plus_D) : 0;

    // [수정] S_locations (60행) : CONFIG 참조
    const S_locations = validResponses.filter(r => SCORING_CONFIG.CODES.LOCATION_S.includes(r.location));
    const S_minus_count = S_locations.filter(r => r.fq === '-').length;
    
    const Populars = validResponses.filter(r => r.popular).length;

    const lastThreeCardsCount = validResponses.filter(r => ['VIII','IX','X'].includes(r.card)).length;
    const firstSevenCardsCount = R - lastThreeCardsCount;
    const Afr = firstSevenCardsCount > 0 ? (lastThreeCardsCount / firstSevenCardsCount) : 0;
    
    // -----------------------------
    // 9) GHR / PHR 분류 (CONFIG 참조)
    // -----------------------------
    function classifyGPHR(r) {
        // [수정] 모든 하드코딩된 배열을 CONFIG 참조
        const hasAnyContent = (arr) => Array.isArray(r.contents) && r.contents.some(c => arr.includes(c));
        const hasAnySS = (arr) => Array.isArray(r.special_scores) && r.special_scores.some(s => arr.includes(s));
        const hasAnyDet = (arr) => Array.isArray(r.determinants) && r.determinants.some(d => arr.includes(d));

        const hasHumanContent = hasAnyContent(SCORING_CONFIG.CODES.HUMAN_CONTENT_GPHR);
        const hasHumanMovement = hasAnyDet(SCORING_CONFIG.CODES.HUMAN_MOVEMENT);
        const hasAnimalMovement = hasAnyDet(SCORING_CONFIG.CODES.ANIMAL_MOVEMENT);
        const hasCopOrAg = hasAnySS(SCORING_CONFIG.CODES.COP_OR_AG);

        const isEligible = hasHumanContent || hasHumanMovement || (hasAnimalMovement && hasCopOrAg);
        if (!isEligible) { return ""; }

        const FQ = r.fq;
        const popular = r.popular;
        const card = r.card;
        const isPureH = hasAnyContent(SCORING_CONFIG.CODES.PURE_H);
        const isGoodFQ = SCORING_CONFIG.CODES.FQ_GOOD.includes(FQ);
        const hasBadCognitiveSS = hasAnySS(SCORING_CONFIG.CODES.COGNITIVE_SS_BAD);
        const hasAgOrMor = hasAnySS(SCORING_CONFIG.CODES.AG_OR_MOR);

        if (isPureH && isGoodFQ && !hasBadCognitiveSS && !hasAgOrMor) { return "GHR"; }

        const isBadFQ = SCORING_CONFIG.CODES.FQ_BAD.includes(FQ);
        const hasLevel2SS = hasAnySS(SCORING_CONFIG.CODES.LEVEL_2_SS);
        
        if (isBadFQ || hasLevel2SS) { return "PHR"; }
        if (hasAnySS(['COP']) && !hasAnySS(['AG'])) { return "GHR"; }
        if (hasAnySS(['FABCOM1', 'MOR']) || hasAnyContent(['An'])) { return "PHR"; }
        if (popular && SCORING_CONFIG.CODES.GPHR_POPULAR_CARDS.includes(card)) { return "GHR"; }
        if (hasAnySS(['AG', 'INCOM1', 'DR1']) || hasAnyContent(['Hd'])) { return "PHR"; }

        return "GHR";
    }

    const row_calculations = validResponses.map(r => ({ gphr: classifyGPHR(r) }));
    const GHR = row_calculations.filter(x => x.gphr === "GHR").length;
    const PHR = row_calculations.filter(x => x.gphr === "PHR").length;
    
    // -----------------------------
    // 9.5) 특수 지표 계산용 추가 변수 (CONFIG 참조)
    // -----------------------------
    const Blends_count = validResponses.filter(r => r.determinants.length > 1).length;
    
    // [수정] 82행 CONFIG 참조
    const isColorDet = (d) => SCORING_CONFIG.CODES.CHROMATIC_COLOR.includes(d);
    // [수정] 82행 'contains' 로직을 CONFIG 참조
    const isShadingDet = (d) => SCORING_CONFIG.CODES.SHADING_ALL_CONTAINS.some(s => d.includes(s));
    
    const ColorShadingBlends = validResponses.filter(r => 
        r.determinants.length > 1 &&
        r.determinants.some(isColorDet) &&
        r.determinants.some(isShadingDet)
    ).length;
    
    const F_pairs = validResponses.filter(r => r.pair === '(2)').length; 
    const Fr = exactCount('Fr', 'determinants');
    const rF = exactCount('rF', 'determinants');
    const EgocentricityIndex = (R > 0) ? (((Fr + rF) * 2 + F_pairs) / R) : 0;
    
    const AB = exactCount('AB', 'special_scores');
    const Art = exactCount('Art', 'contents');
    const Ay = exactCount('Ay', 'contents');

    const Bt = exactCount('Bt', 'contents');
    const Cl = exactCount('Cl', 'contents');
    const Ge = exactCount('Ge', 'contents');
    const Ls = exactCount('Ls', 'contents');
    const Na = exactCount('Na', 'contents');
    const IsolateIndex = (R > 0) ? ((Bt + 2 * Cl + Ge + Ls + 2 * Na) / R) : 0;
    
    const Food = exactCount('Fd', 'contents');
    const Cg = exactCount('Cg', 'contents');
    
    // -----------------------------
    // 10) Special Indices (CONFIG 참조)
    // -----------------------------
    const COP = exactCount('COP', 'special_scores');
    const AG  = exactCount('AG',  'special_scores');
    const MOR = exactCount('MOR', 'special_scores');
    const PSV = exactCount('PSV', 'special_scores');

    // [수정] M_minus (92행) : CONFIG 참조 (요청사항 확인)
    const M_minus = validResponses.reduce((acc, r) => {
        if (r.fq === '-') {
            // 'M' 그룹 코드를 포함하는 반응의 개수를 셈
            const countInRow = r.determinants.filter(det => 
                SCORING_CONFIG.CODES.HUMAN_MOVEMENT.includes(det)
            ).length;
            // 한 반응에 M, Ma가 있어도 1로 계산하기 위해 (countInRow > 0 ? 1 : 0) 사용
            return acc + (countInRow > 0 ? 1 : 0); 
        }
        return acc;
    }, 0);
    
    // *참고*: 92행의 M_minus 원본 로직은 filter(..).length를 썼는데, 
    //        이는 블렌드(M, Ma)시 2 이상이 될 수 있습니다.
    //        만약 "M 그룹이 포함된 반응 수"가 맞다면 위 (countInRow > 0 ? 1 : 0)가 맞고,
    //        "M 그룹 코드의 총 개수"가 맞다면 원본 로직(..).length;가 맞습니다.
    //        (현재는 M_minus_ideation (144행)에 쓰이므로 '반응 수'로 가정하고 수정했습니다.)


    // [수정] WSum6 (93-94행) : CONFIG 참조
    const WSum6_weights_table = SCORING_CONFIG.TABLES.WSUM6_WEIGHTS;
    const WSum6 = validResponses.reduce((acc, r) => {
      if (!Array.isArray(r.special_scores)) return acc;
      return acc + r.special_scores.reduce((s, ss) => s + (WSum6_weights_table[ss] || 0), 0);
    }, 0);
    
    // [수정] Level2_count (95행) : CONFIG 참조
    const FABCOM2 = exactCount('FABCOM2', 'special_scores');
    const Level2_count = SCORING_CONFIG.CODES.LEVEL_2_SS
        .reduce((sum, code) => sum + exactCount(code, 'special_scores'), 0);

    const FV = exactCount('FV', 'determinants');
    const VF = exactCount('VF', 'determinants');
    const V = exactCount('V', 'determinants');
    const FD = exactCount('FD', 'determinants');

    // [수정] active/passive (97행) : CONFIG 참조
    const active_dets  = countContainsAny(SCORING_CONFIG.CODES.MOVEMENT_ACTIVE);
    const passive_dets = countContainsAny(SCORING_CONFIG.CODES.MOVEMENT_PASSIVE);
    
    const PureH = exactCount('H', 'contents');
    const Ma = exactCount('Ma') + exactCount('Ma-p');
    const Mp = exactCount('Mp') + exactCount('Ma-p');
    
    // [수정] Mnone (98행) : CONFIG 참조
    const Mnone = validResponses.filter(r => 
        r.fq === 'none' && 
        countContainsAnyInRow(r, SCORING_CONFIG.CODES.HUMAN_MOVEMENT) > 0
    ).length;
    
    // [수정] contentCounts (99행) : CONFIG 참조
    const contentCounts = {};
    const allContents = SCORING_CONFIG.CODES.ALL_CONTENTS;
    allContents.forEach(con => {
        contentCounts[con] = exactCount(con, 'contents');
    });
    
    // [수정] HumanCont (101행) : CONFIG 참조
    const HumanCont = SCORING_CONFIG.CODES.HUMAN_CONTENT_ALL
        .reduce((sum, code) => sum + (contentCounts[code] || 0), 0);

    // --- PTI (102행) (CONFIG 참조) ---
    const PTI_C = SCORING_CONFIG.CRITERIA.PTI;
    const pti_criteria = {
        c1: (XA_percent < PTI_C.C1_XA_PERCENT && WDA_percent < PTI_C.C1_WDA_PERCENT),
        c2: (X_minus_percent > PTI_C.C2_X_MINUS_PERCENT),
        c3: (Level2_count > PTI_C.C3_LEVEL2_COUNT && FABCOM2 > PTI_C.C3_FABCOM2_COUNT),
        c4: ((R < PTI_C.C4_R_LOW && WSum6 > PTI_C.C4_WSUM6_LOW) || (R > PTI_C.C4_R_HIGH && WSum6 > PTI_C.C4_WSUM6_HIGH)),
        c5: (M_minus > PTI_C.C5_M_MINUS || X_minus_percent > PTI_C.C5_X_MINUS_PERCENT)
    };
    const pti_score = Object.values(pti_criteria).filter(val => val === true).length;
    const PTI_val = `${pti_score}, -`;

    // --- DEPI (104-106행) (CONFIG 참조) ---
    const DEPI_C = SCORING_CONFIG.CRITERIA.DEPI;
    const depi_criteria = {
        c1: ((FV + VF + V > DEPI_C.C1_V_COUNT) || (FD > DEPI_C.C1_FD_COUNT)),
        c2: ((ColorShadingBlends > DEPI_C.C2_COLOR_SHADING_BLENDS) || (S > DEPI_C.C2_S_COUNT)),
        c3: ((EgocentricityIndex > DEPI_C.C3_EGO_MAX && (Fr + rF) === DEPI_C.C3_EGO_NO_REF) || (EgocentricityIndex < DEPI_C.C3_EGO_MIN)),
        c4: ((Afr < DEPI_C.C4_AFR) || (Blends_count < DEPI_C.C4_BLENDS)),
        c5: ((SumShadingAll > (FM_total + m_total)) || (SumCprime > DEPI_C.C5_SUM_C_PRIME)),
        c6: ((MOR > DEPI_C.C6_MOR) || ((2 * AB + Art + Ay) > DEPI_C.C6_INTELLECT)),
        c7: ((COP < DEPI_C.C7_COP) || (IsolateIndex > DEPI_C.C7_ISOLATE))
    };
    const depi_score = Object.values(depi_criteria).filter(val => val === true).length;
    const DEPI_val = `${depi_score}, ${depi_score >= DEPI_C.SCORE_THRESHOLD ? 'Positive' : 'NO'}`;

    // --- CDI (107-108행) (CONFIG 참조) ---
    const CDI_C = SCORING_CONFIG.CRITERIA.CDI;
    const cdi_criteria = {
        c1: (EA < CDI_C.C1_EA || AdjD_bucket < CDI_C.C1_ADJ_D),
        c2: (COP < CDI_C.C2_COP && AG < CDI_C.C2_AG),
        c3: (WSumC < CDI_C.C3_WSUMC || Afr < CDI_C.C3_AFR),
        c4: ((passive_dets > active_dets + CDI_C.C4_PASSIVE_RATIO) || PureH < CDI_C.C4_PURE_H),
        c5: (SumT > CDI_C.C5_SUM_T || IsolateIndex > CDI_C.C5_ISOLATE || Food > CDI_C.C5_FOOD)
    };
    const cdi_score = Object.values(cdi_criteria).filter(val => val === true).length;
    const CDI_val = `${cdi_score}, ${cdi_score >= CDI_C.SCORE_THRESHOLD ? 'Positive' : 'NO'}`;

    // --- S-CON (109-112행) (CONFIG 참조) ---
    const SCON_C = SCORING_CONFIG.CRITERIA.SCON;
    const scon_criteria = {
        c1: (FV + VF + V + FD) > SCON_C.C1_VISTA_FD,
        c2: ColorShadingBlends > SCON_C.C2_COLOR_SHADING_BLENDS,
        c3: EgocentricityIndex < SCON_C.C3_EGO_MIN || EgocentricityIndex > SCON_C.C3_EGO_MAX,
        c4: MOR > SCON_C.C4_MOR,
        c5: (typeof Zd === 'number') && (Zd < SCON_C.C5_ZD_MIN || Zd > SCON_C.C5_ZD_MAX),
        c6: es > EA,
        c7: (CF + C) > (FC + SCON_C.C7_FC_RATIO - 1), // (CF+C > FC)
        c8: X_plus_percent < SCON_C.C8_X_PLUS_PERCENT,
        c9: S > SCON_C.C9_S,
        c10: Populars < SCON_C.C10_P_MIN || Populars > SCON_C.C10_P_MAX,
        c11: PureH < SCON_C.C11_PURE_H,
        c12: R < SCON_C.C12_R
    };
    const scon_score = Object.values(scon_criteria).filter(val => val === true).length;
    const SCON_val = `${scon_score}, ${scon_score >= SCON_C.SCORE_THRESHOLD ? 'Positive' : 'NO'}`;
    
    // --- HVI (113-117행) (CONFIG 참조) ---
    const HVI_C = SCORING_CONFIG.CRITERIA.HVI;
    const hvi_criteria = {
        c1: SumT === HVI_C.C1_SUM_T,
        c2: Zf > HVI_C.C2_ZF,
        c3: (typeof Zd === 'number') && Zd > HVI_C.C3_ZD,
        c4: S > HVI_C.C4_S,
        c5: HumanCont > HVI_C.C5_HUMAN_CONT,
        c6: (contentCounts['(H)'] + contentCounts['(A)'] + contentCounts['(Hd)'] + contentCounts['(Ad)']) > HVI_C.C6_PAREN_CONT,
        c7: (contentCounts['Hd'] + contentCounts['Ad']) > 0 ?
           ((contentCounts['H'] + contentCounts['A']) / (contentCounts['Hd'] + contentCounts['Ad'])) < HVI_C.C7_H_HD_RATIO : false,
        c8: Cg > HVI_C.C8_CG
    };
    const hvi_sub_score = Object.keys(hvi_criteria).slice(1).reduce((acc, key) => acc + (hvi_criteria[key] ? 1 : 0), 0);
    const is_hvi_positive = hvi_criteria.c1 && hvi_sub_score >= HVI_C.SUB_SCORE_THRESHOLD;
    const hvi_total_checks = Object.values(hvi_criteria).filter(val => val === true).length;
    const HVI_val = `${hvi_total_checks}, ${is_hvi_positive ? 'Positive' : 'NO'}`;

    // --- OBS (118-120행) (CONFIG 참조) ---
    const OBS_C = SCORING_CONFIG.CRITERIA.OBS;
    const obs_criteria = {
        c1: Dd > OBS_C.C1_DD,
        c2: Zf > OBS_C.C2_ZF,
        c3: (typeof Zd === 'number') && Zd > OBS_C.C3_ZD,
        c4: Populars > OBS_C.C4_P,
        c5: fq_plus_count > OBS_C.C5_FQ_PLUS
    };
    const obs_rules = {
        r1: obs_criteria.c1 && obs_criteria.c2 && obs_criteria.c3 && obs_criteria.c4 && obs_criteria.c5,
        r2: (Object.keys(obs_criteria).slice(0, 4).reduce((acc, key) => acc + (obs_criteria[key] ? 1 : 0), 0) >= OBS_C.R2_CRITERIA_COUNT) && (fq_plus_count > OBS_C.R2_FQ_PLUS_COUNT),
        r3: (Object.values(obs_criteria).filter(v => v).length >= OBS_C.R3_CRITERIA_COUNT) && ((X_plus_percent) > OBS_C.R3_X_PLUS_PERCENT), 
        r4: (fq_plus_count > OBS_C.R4_FQ_PLUS_COUNT) && ((X_plus_percent) > OBS_C.R4_X_PLUS_PERCENT)
    };
    const obs_score = Object.values(obs_rules).filter(v => v).length;
    const is_obs_positive = obs_score > 0;
    const obs_criteria_score = Object.values(obs_criteria).filter(val => val === true).length;
    const OBS_val = `${obs_criteria_score}, ${is_obs_positive ? 'Positive' : 'NO'}`;

    // =================================================================
    // 10.5) Upper Section 상세 계산 (CONFIG 참조)
    // =================================================================
    const dq_plus = validResponses.filter(r => r.dq === '+').length;
    const dq_o = validResponses.filter(r => r.dq === 'o').length;
    const dq_vplus = validResponses.filter(r => r.dq === 'v/+').length;
    const dq_v = validResponses.filter(r => r.dq === 'v').length;

    const formQualityCalculations = {};
    // [수정] 123행 CONFIG 참조
    const fqTypes = SCORING_CONFIG.DEFAULTS.FQ_TYPES;
    // [수정] 124행 CONFIG 참조 (핫픽스 수정 사항 자동 반영)
    const MQualDeterminants = SCORING_CONFIG.CODES.HUMAN_MOVEMENT; 

    fqTypes.forEach(fq => {
        const responsesWithFq = validResponses.filter(r => r.fq === fq);
        const mqual_count = responsesWithFq.reduce((total, response) => {
            // [수정] 125행 CONFIG 참조
            const matchingDetsInResponse = response.determinants.filter(det => MQualDeterminants.includes(det)).length;
            
            // MQual도 '반응의 개수'가 맞다면 (countInRow > 0 ? 1 : 0)을 써야 합니다.
            // 일단 원본(핫픽스 포함) 로직(length)을 유지합니다.
            return total + matchingDetsInResponse;
        }, 0);
        formQualityCalculations[fq] = {
            fqx: responsesWithFq.length,
            mqual: mqual_count,
            // [수정] 126행 CONFIG 참조
            wd: responsesWithFq.filter(r => SCORING_CONFIG.CODES.LOCATION_WD.includes(r.location)).length
        };
    });
    
    const blends = validResponses.filter(r => r.determinants.length > 1).map(r => r.determinants);

    // [수정] 127-128행 CONFIG 참조
    const detCounts = {};
    const allDeterminants = SCORING_CONFIG.CODES.ALL_DETERMINANTS;
    allDeterminants.forEach(det => {
        detCounts[det] = exactCount(det);
    });
    
    // 집계용 M, FM, m 값 덮어쓰기 (수정 없음)
    const determinantSummary = { ...detCounts };
    determinantSummary['M'] = M_total;
    determinantSummary['FM'] = FM_total;
    determinantSummary['m'] = m_total;

    // [수정] 130-131행 CONFIG 참조
    const singleDetCounts = {};
    const singleDeterminantTypes = SCORING_CONFIG.CODES.DETERMINANTS_SINGLE;
    singleDeterminantTypes.forEach(d => singleDetCounts[d] = 0);

    // [수정] 131행 CONFIG 참조
    validResponses.filter(r => r.determinants.length === 1).forEach(r => {
        const det = r.determinants[0];
        if (SCORING_CONFIG.CODES.HUMAN_MOVEMENT.includes(det)) singleDetCounts['M']++;
        else if (SCORING_CONFIG.CODES.ANIMAL_MOVEMENT.includes(det)) singleDetCounts['FM']++;
        else if (SCORING_CONFIG.CODES.INANIMATE_MOVEMENT.includes(det)) singleDetCounts['m']++;
        else if (singleDetCounts.hasOwnProperty(det)) singleDetCounts[det]++;
    });
    
    // [수정] 132-133행 CONFIG 참조
    const approachData = {};
    const cardOrder = SCORING_CONFIG.DEFAULTS.CARD_ORDER;
    cardOrder.forEach(card => approachData[card] = []);

    validResponses.forEach(r => {
        if (r.card && approachData[r.card]) {
            approachData[r.card].push(r.location);
        }
    });

    // 특수 점수 집계 (수정 없음, 134행)
    const specialScoreCounts = {
        DV1: exactCount('DV1', 'special_scores'),
        INCOM1: exactCount('INCOM1', 'special_scores'),
        DR1: exactCount('DR1', 'special_scores'),
        FABCOM1: exactCount('FABCOM1', 'special_scores'),
        DV2: exactCount('DV2', 'special_scores'),
        INCOM2: exactCount('INCOM2', 'special_scores'),
        DR2: exactCount('DR2', 'special_scores'),
        FABCOM2: exactCount('FABCOM2', 'special_scores'),
        ALOG: exactCount('ALOG', 'special_scores'),
        CONTAM: exactCount('CONTAM', 'special_scores'),
        AB: AB, AG: AG, COP: COP, MOR: MOR,
        CP: exactCount('CP', 'special_scores'),
        PER: exactCount('PER', 'special_scores'),
        PSV: PSV
    };
    const sum6 = specialScoreCounts.DV1 + specialScoreCounts.INCOM1 + specialScoreCounts.DR1 + specialScoreCounts.FABCOM1 + specialScoreCounts.DV2 + specialScoreCounts.INCOM2 + specialScoreCounts.DR2 + specialScoreCounts.FABCOM2 + specialScoreCounts.ALOG + specialScoreCounts.CONTAM;
    
    // [수정] wsum6_val (137행) : 이미 계산된 WSum6 변수 사용
    const wsum6_val = WSum6; 

    // -----------------------------
    // 11) 결과 패키징 (수정 없음, 138-147행)
    // -----------------------------
    const resultData = {
      upper_section: {
        Zf, ZSum: fix1(ZSum), ZEst: (typeof ZEst === 'number' ? fix1(ZEst) : '-'), Zd: (typeof Zd === 'number' ? fix1(Zd) : '-'),
        W, D: D_loc, Dd, S,
        dq_plus, dq_o, dq_vplus, dq_v,
        formQuality: formQualityCalculations,
        blends,
        detCounts: determinantSummary,
        singleDetCounts,
        approachData,
        contentCounts,
        pairs: F_pairs,
        specialScoreCounts,
        sum6, wsum6: wsum6_val,
        GHR, PHR
      },
      lower_section: {
        R, 
        Lambda: fix2(Lambda), 
        EB: `${M_total}:${fix1(WSumC)}`,
        EA: fix1(EA),
        EBPer: EBPer,
        eb: `${es_left}:${SumShadingAll}`,
        es: fix1(es),
        AdjEs: fix1(AdjEs),
        D: D_bucket,
        AdjD: AdjD_bucket,
        FM: FM_total,
        m: m_total,
        SumCprime: SumCprime,
        SumT: SumT,
        SumV: SumV,
        SumY: SumY,
        Afr: fix2(Afr),
        XA_percent: fix2(XA_percent),
        WDA_percent: fix2(WDA_percent),
        X_minus_percent: fix2(X_minus_percent),
        S_minus: S_minus_count,
        P: Populars,
        X_plus_percent: fix2(X_plus_percent),
        Xu_percent: fix2(Xu_percent),
        Zf: Zf,
        Zd: (typeof Zd === 'number' ? fix1(Zd) : '-'),
        PSV: PSV,
        DQ_plus: dq_plus,
        DQ_v: dq_v,
        W_D_Dd: `${W}:${D_loc}:${Dd}`,
        W_M: `${W}:${M_total}`,
        a_p: `${active_dets} : ${passive_dets}`,
        Ma_Mp: `${Ma} : ${Mp}`,
        _2AB_Art_Ay: 2 * AB + Art + Ay,
        MOR: MOR,
        Sum6: sum6,
        Lv2: Level2_count,
        WSum6_ideation: wsum6_val,
        M_minus_ideation: M_minus,
        Mnone: Mnone,
        FC_CF_C: `${FC} : ${CF + C}`,
        PureC: C,
        SumC_WSumC: `${SumCprime} : ${fix1(WSumC)}`,
        S_aff: S,
        Blends_R: `${Blends_count} : ${R}`,
        CP: exactCount('CP', 'special_scores'),
        _3r_2_R: fix2(EgocentricityIndex),
        Fr_rF: Fr + rF,
        SumV_self: SumV,
        FD: FD,
        An_Xy: contentCounts['An'] + contentCounts['Xy'],
        MOR_self: MOR,
        H_ratio: `${PureH} : ${contentCounts['(H)'] + contentCounts['Hd'] + contentCounts['(Hd)']}`,
        COP: COP,
        AG: AG,
        a_p_inter: `${active_dets} : ${passive_dets}`,
        Food: Food,
        SumT_inter: SumT,
        HumanCont: HumanCont,
        PureH: PureH,
        PER: specialScoreCounts.PER,
        ISO_Index: fix2(IsolateIndex)
      },
      special_indices: {
        PTI: PTI_val, pti_criteria,
        DEPI: DEPI_val, depi_criteria,
        CDI: CDI_val, cdi_criteria,
        SCON: SCON_val, scon_criteria,
        HVI: HVI_val, hvi_criteria,
        OBS: OBS_val, obs_criteria, obs_rules,
        GHR, PHR
      },
      row_calculations
    };

    return { success: true, results: resultData };

  } catch (e) {
    Logger.log(`ERROR in calculateRorschach: ${e.toString()} at line ${e.lineNumber}. Stack: ${e.stack}`);
    return { success: false, error: e && e.lineNumber ? `${e.toString()} (line ${e.lineNumber})` : String(e) };
  }
}