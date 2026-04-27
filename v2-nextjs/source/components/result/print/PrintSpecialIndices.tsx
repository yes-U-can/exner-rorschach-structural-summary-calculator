'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface PrintSpecialIndicesProps {
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
  };
}

type Criterion = { label: string; met: boolean };

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-[2px] border text-[8px] ${
        checked ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 bg-white text-transparent'
      }`}
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

function CriteriaList({ items }: { items: Criterion[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-1">
          <Checkbox checked={item.met} />
          <span className={`text-[8px] leading-tight ${item.met ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function PrintIndexCard({
  title,
  summary,
  items,
  note,
}: {
  title: string;
  summary?: string;
  items: Criterion[];
  note?: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2">
      <h3 className="border-b border-slate-200 pb-1 text-center text-[9px] font-semibold text-slate-800">{title}</h3>
      {summary ? <p className="mt-1 text-[8px] font-medium text-slate-600">{summary}</p> : null}
      {note ? <p className="mt-0.5 text-[7px] text-amber-600">{note}</p> : null}
      <div className="mt-1.5">
        <CriteriaList items={items} />
      </div>
    </section>
  );
}

export default function PrintSpecialIndices({ data }: PrintSpecialIndicesProps) {
  const { t } = useTranslation();

  const ptiCriteria: Criterion[] = [
    { label: '(1) XA% < .70 & WDA% < .75', met: data.pti_criteria.c1 },
    { label: '(2) X-% > .29', met: data.pti_criteria.c2 },
    { label: '(3) Lv2 > 2 & FAB2 > 0', met: data.pti_criteria.c3 },
    { label: '(4) R<17 & WSum6>12 or R>16 & WSum6>17', met: data.pti_criteria.c4 },
    { label: '(5) M- > 1 or X-% > .40', met: data.pti_criteria.c5 },
  ];

  const depiCriteria: Criterion[] = [
    { label: '(1) FV+VF+V > 0 or FD > 2', met: data.depi_criteria.c1 },
    { label: '(2) Col-Shd Bl > 0 or S > 2', met: data.depi_criteria.c2 },
    { label: '(3) 3r+(2)/R > .44 & Fr+rF=0 or < .33', met: data.depi_criteria.c3 },
    { label: '(4) Afr < .46 or Bl < 4', met: data.depi_criteria.c4 },
    { label: "(5) SumShading > FM+m or SumC' > 2", met: data.depi_criteria.c5 },
    { label: '(6) MOR > 2 or 2AB+Art+Ay > 3', met: data.depi_criteria.c6 },
    { label: '(7) COP < 2 or Isol > .24', met: data.depi_criteria.c7 },
  ];

  const cdiCriteria: Criterion[] = [
    { label: '(1) EA < 6 or AdjD < 0', met: data.cdi_criteria.c1 },
    { label: '(2) COP < 2 & AG < 2', met: data.cdi_criteria.c2 },
    { label: '(3) WSumC < 2.5 or Afr < .46', met: data.cdi_criteria.c3 },
    { label: '(4) p > a+1 or H < 2', met: data.cdi_criteria.c4 },
    { label: '(5) T > 1 or Isol > .24 or Fd > 0', met: data.cdi_criteria.c5 },
  ];

  const sconCriteria: Criterion[] = [
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

  const hviCriteria: Criterion[] = [
    { label: '(1) FT+TF+T = 0', met: data.hvi_criteria.c1 },
    { label: '(2) Zf > 12', met: data.hvi_criteria.c2 },
    { label: '(3) Zd > +3.5', met: data.hvi_criteria.c3 },
    { label: '(4) S > 3', met: data.hvi_criteria.c4 },
    { label: '(5) H+(H)+Hd+(Hd) > 6', met: data.hvi_criteria.c5 },
    { label: '(6) (H)+(A)+(Hd)+(Ad) > 3', met: data.hvi_criteria.c6 },
    { label: '(7) H+A : Hd+Ad < 4:1', met: data.hvi_criteria.c7 },
    { label: '(8) Cg > 3', met: data.hvi_criteria.c8 },
  ];

  const obsRules: Criterion[] = [
    { label: `${t('specialIndices.obs_r1')}`, met: data.obs_rules.r1 },
    { label: `${t('specialIndices.obs_r2')} & FQ+ > 3`, met: data.obs_rules.r2 },
    { label: `${t('specialIndices.obs_r3')} & X+% > .89`, met: data.obs_rules.r3 },
    { label: 'FQ+ > 3 & X+% > .89', met: data.obs_rules.r4 },
    { label: '(1) Dd > 3', met: data.obs_criteria.c1 },
    { label: '(2) Zf > 12', met: data.obs_criteria.c2 },
    { label: '(3) Zd > +3.0', met: data.obs_criteria.c3 },
    { label: '(4) P > 7', met: data.obs_criteria.c4 },
    { label: '(5) FQ+ > 1', met: data.obs_criteria.c5 },
  ];

  return (
    <div id="Special_Indices_Print" className="grid grid-cols-3 gap-1.5">
      <PrintIndexCard
        title="S-Constellation"
        summary={t('specialIndices.scon_main')}
        note={t('specialIndices.scon_note')}
        items={sconCriteria}
      />
      <PrintIndexCard title="DEPI" summary={t('specialIndices.depi_main')} items={depiCriteria} />
      <PrintIndexCard title="PTI" items={ptiCriteria} />
      <PrintIndexCard title="CDI" summary={t('specialIndices.cdi_main')} items={cdiCriteria} />
      <PrintIndexCard title="HVI" summary={t('specialIndices.hvi_main')} items={hviCriteria} />
      <PrintIndexCard title="OBS" summary={t('specialIndices.obs_main')} items={obsRules} />
    </div>
  );
}
