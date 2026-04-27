'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface SpecialIndicesProps {
  printMode?: boolean;
  data: {
    PTI: string;
    pti_criteria: Record<string, boolean>;
    DEPI: string;
    depi_criteria: Record<string, boolean>;
    CDI: string;
    cdi_criteria: Record<string, boolean>;
    SCON: string;
    scon_criteria: Record<string, boolean>;
    HVI: string;
    hvi_criteria: Record<string, boolean>;
    OBS: string;
    obs_criteria: Record<string, boolean>;
    obs_rules: Record<string, boolean>;
    GHR: number;
    PHR: number;
  };
}

type IndexCriterion = { label: string; met: boolean; primary?: boolean };

function Checkbox({ checked, compact = false }: { checked: boolean; compact?: boolean }) {
  return (
    <div
      className={`flex-shrink-0 rounded-sm border flex items-center justify-center mt-0.5 ${
        compact ? 'w-3 h-3 mr-1.5' : 'w-4 h-4 mr-2'
      } ${
        checked
          ? 'border-[var(--success-icon)] bg-[var(--success-icon)]'
          : 'border-[var(--border-subtle)] bg-[var(--surface-input)]'
      }`}
    >
      {checked && (
        <svg
          className={`${compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-[var(--on-brand)]`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}

function CriterionItem({
  label,
  met,
  highlight = false,
  compact = false,
}: {
  label: string;
  met: boolean;
  highlight?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start ${compact ? 'py-0.5' : 'py-1'} ${
        highlight ? `border-b border-[var(--border-subtle)] font-bold ${compact ? 'mb-1 pb-1' : 'mb-1 pb-2'}` : ''
      }`}
    >
      <Checkbox checked={met} compact={compact} />
      <span className={`${compact ? 'text-[9px] leading-snug' : 'text-[11px] leading-relaxed'} ${met ? 'text-[var(--text-strong)]' : 'text-[var(--text-soft)]'}`}>
        {label}
      </span>
    </div>
  );
}

function IndexCard({
  title,
  isPositive,
  thresholdLabel,
  criteria,
  note,
  compact = false,
}: {
  title: string;
  isPositive: boolean;
  thresholdLabel: string;
  criteria: IndexCriterion[];
  note?: string;
  compact?: boolean;
}) {
  return (
    <div className={`rounded border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-body)] ${compact ? 'p-2' : 'p-3'}`}>
      <h3 className={`${compact ? 'mb-1 pb-1 text-[10px]' : 'mb-2 pb-2 text-sm'} border-b border-[var(--border-subtle)] text-center font-semibold text-[var(--text-strong)]`}>
        {title}
      </h3>

      <div className={`flex items-start border-b border-[var(--border-subtle)] ${compact ? 'mb-2 pb-1' : 'mb-3 pb-2'}`}>
        <Checkbox checked={isPositive} compact={compact} />
        <div>
          <span className={`${compact ? 'text-[9px] leading-snug' : 'text-[11px] leading-relaxed'} ${isPositive ? 'font-bold text-[var(--danger-text)]' : 'text-[var(--text-body)]'}`}>
            {thresholdLabel}
          </span>
          {note ? (
            <span className={`mt-0.5 block text-[var(--warning-text)] ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
              {note}
            </span>
          ) : null}
        </div>
      </div>

      <div>
        {criteria.map((item, index) => (
          <CriterionItem
            key={index}
            label={item.label}
            met={item.met}
            highlight={item.primary}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

export default function SpecialIndices({ data, printMode = false }: SpecialIndicesProps) {
  const { t } = useTranslation();

  const parseIndex = (value: string) => {
    const [score, result] = value.split(', ');
    return { score: parseInt(score, 10) || 0, isPositive: result === 'Positive' };
  };

  const ptiCriteria: IndexCriterion[] = [
    { label: '(1) XA% < .70 & WDA% < .75', met: data.pti_criteria.c1 },
    { label: '(2) X-% > .29', met: data.pti_criteria.c2 },
    { label: '(3) Lv2 > 2 & FAB2 > 0', met: data.pti_criteria.c3 },
    { label: '(4) R<17 & WSum6>12 or R>16 & WSum6>17', met: data.pti_criteria.c4 },
    { label: '(5) M- > 1 or X-% > .40', met: data.pti_criteria.c5 },
  ];

  const depiCriteria: IndexCriterion[] = [
    { label: '(1) FV+VF+V > 0 or FD > 2', met: data.depi_criteria.c1 },
    { label: '(2) Col-Shd Bl > 0 or S > 2', met: data.depi_criteria.c2 },
    { label: '(3) 3r+(2)/R > .44 & Fr+rF=0 or < .33', met: data.depi_criteria.c3 },
    { label: '(4) Afr < .46 or Bl < 4', met: data.depi_criteria.c4 },
    { label: "(5) SumShading > FM+m or SumC' > 2", met: data.depi_criteria.c5 },
    { label: '(6) MOR > 2 or 2AB+Art+Ay > 3', met: data.depi_criteria.c6 },
    { label: '(7) COP < 2 or Isol > .24', met: data.depi_criteria.c7 },
  ];

  const cdiCriteria: IndexCriterion[] = [
    { label: '(1) EA < 6 or AdjD < 0', met: data.cdi_criteria.c1 },
    { label: '(2) COP < 2 & AG < 2', met: data.cdi_criteria.c2 },
    { label: '(3) WSumC < 2.5 or Afr < .46', met: data.cdi_criteria.c3 },
    { label: '(4) p > a+1 or H < 2', met: data.cdi_criteria.c4 },
    { label: '(5) T > 1 or Isol > .24 or Fd > 0', met: data.cdi_criteria.c5 },
  ];

  const sconCriteria: IndexCriterion[] = [
    { label: '(1) FV+VF+V+FD > 2', met: data.scon_criteria.c1 },
    { label: '(2) Color-Shading Blends > 0', met: data.scon_criteria.c2 },
    { label: '(3) 3r+(2)/R < .31 or > .44', met: data.scon_criteria.c3 },
    { label: '(4) MOR > 3', met: data.scon_criteria.c4 },
    { label: '(5) Zd > +3.5 or Zd < -3.5', met: data.scon_criteria.c5 },
    { label: '(6) es > EA', met: data.scon_criteria.c6 },
    { label: '(7) CF+C > FC', met: data.scon_criteria.c7 },
    { label: '(8) X+% < .70', met: data.scon_criteria.c8 },
    { label: '(9) S > 3', met: data.scon_criteria.c9 },
    { label: '(10) P < 3 or P > 8', met: data.scon_criteria.c10 },
    { label: '(11) H < 2', met: data.scon_criteria.c11 },
    { label: '(12) R < 17', met: data.scon_criteria.c12 },
  ];

  const hviCriteria: IndexCriterion[] = [
    { label: '(1) FT+TF+T = 0', met: data.hvi_criteria.c1, primary: true },
    { label: '(2) Zf > 12', met: data.hvi_criteria.c2 },
    { label: '(3) Zd > +3.5', met: data.hvi_criteria.c3 },
    { label: '(4) S > 3', met: data.hvi_criteria.c4 },
    { label: '(5) H+(H)+Hd+(Hd) > 6', met: data.hvi_criteria.c5 },
    { label: '(6) (H)+(A)+(Hd)+(Ad) > 3', met: data.hvi_criteria.c6 },
    { label: '(7) H+A : Hd+Ad < 4:1', met: data.hvi_criteria.c7 },
    { label: '(8) Cg > 3', met: data.hvi_criteria.c8 },
  ];

  const obsCriteria: IndexCriterion[] = [
    { label: '(1) Dd > 3', met: data.obs_criteria.c1 },
    { label: '(2) Zf > 12', met: data.obs_criteria.c2 },
    { label: '(3) Zd > +3.0', met: data.obs_criteria.c3 },
    { label: '(4) P > 7', met: data.obs_criteria.c4 },
    { label: '(5) FQ+ > 1', met: data.obs_criteria.c5 },
  ];

  const obsRules: IndexCriterion[] = [
    { label: `${t('specialIndices.obs_r1')}`, met: data.obs_rules.r1 },
    { label: `${t('specialIndices.obs_r2')} & FQ+ > 3`, met: data.obs_rules.r2 },
    { label: `${t('specialIndices.obs_r3')} & X+% > .89`, met: data.obs_rules.r3 },
    { label: 'FQ+ > 3 & X+% > .89', met: data.obs_rules.r4 },
  ];

  const depi = parseIndex(data.DEPI);
  const cdi = parseIndex(data.CDI);
  const scon = parseIndex(data.SCON);
  const hvi = parseIndex(data.HVI);
  const obs = parseIndex(data.OBS);

  return (
    <div
      id="Special_Indices"
      className={printMode ? 'grid gap-1' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'}
      style={printMode ? { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: '1fr' } : undefined}
    >
      <IndexCard
        title="S-Constellation"
        isPositive={scon.isPositive}
        thresholdLabel={t('specialIndices.scon_main')}
        criteria={sconCriteria}
        note={t('specialIndices.scon_note')}
        compact={printMode}
      />

      <IndexCard
        title="DEPI"
        isPositive={depi.isPositive}
        thresholdLabel={t('specialIndices.depi_main')}
        criteria={depiCriteria}
        compact={printMode}
      />

      <div className={`rounded border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-body)] ${printMode ? 'p-2' : 'p-3'}`}>
        <h3 className={`${printMode ? 'mb-1 pb-1 text-[10px]' : 'mb-2 pb-2 text-sm'} border-b border-[var(--border-subtle)] text-center font-semibold text-[var(--text-strong)]`}>
          PTI
        </h3>
        <div>
          {ptiCriteria.map((item, index) => (
            <CriterionItem key={index} label={item.label} met={item.met} compact={printMode} />
          ))}
        </div>
      </div>

      <IndexCard
        title="CDI"
        isPositive={cdi.isPositive}
        thresholdLabel={t('specialIndices.cdi_main')}
        criteria={cdiCriteria}
        compact={printMode}
      />

      <IndexCard
        title="HVI"
        isPositive={hvi.isPositive}
        thresholdLabel={t('specialIndices.hvi_main')}
        criteria={hviCriteria}
        compact={printMode}
      />

      <div className={`rounded border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-body)] ${printMode ? 'p-2' : 'p-3'}`}>
        <h3 className={`${printMode ? 'mb-1 pb-1 text-[10px]' : 'mb-2 pb-2 text-sm'} border-b border-[var(--border-subtle)] text-center font-semibold text-[var(--text-strong)]`}>
          OBS
        </h3>

        <div className={`flex items-start border-b border-[var(--border-subtle)] ${printMode ? 'mb-2 pb-1' : 'mb-3 pb-2'}`}>
          <Checkbox checked={obs.isPositive} compact={printMode} />
          <span className={`${printMode ? 'text-[9px] leading-snug' : 'text-[11px] leading-relaxed'} ${obs.isPositive ? 'font-bold text-[var(--danger-text)]' : 'text-[var(--text-body)]'}`}>
            {t('specialIndices.obs_main')}
          </span>
        </div>

        <div className="mb-2">
          {obsRules.map((item, index) => (
            <CriterionItem key={`rule-${index}`} label={item.label} met={item.met} compact={printMode} />
          ))}
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-2">
          {obsCriteria.map((item, index) => (
            <CriterionItem key={`criterion-${index}`} label={item.label} met={item.met} compact={printMode} />
          ))}
        </div>
      </div>
    </div>
  );
}
