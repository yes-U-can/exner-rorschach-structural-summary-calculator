'use client';

interface SpecialIndicesData {
  PTI?: string;
  DEPI?: string;
  CDI?: string;
  SCON?: string;
  HVI?: string;
  OBS?: string;
}

interface PrintLowerSectionProps {
  specialIndices?: SpecialIndicesData;
  data: {
    R: number;
    Lambda: string;
    EB: string;
    EA: string;
    EBPer: string | number;
    eb: string;
    es: string;
    D: number | string;
    AdjD: number | string;
    AdjEs: string;
    FM: number;
    m: number;
    SumCprime: number;
    SumT: number;
    SumV: number;
    SumY: number;
    a_p: string;
    Ma_Mp: string;
    _2AB_Art_Ay: number;
    MOR: number;
    Sum6: number;
    Lv2: number;
    WSum6_ideation: number;
    M_minus_ideation: number;
    Mnone: number;
    FC_CF_C: string;
    PureC: number;
    SumC_WSumC: string;
    Afr: string;
    S_aff: number;
    Blends_R: string;
    CP: number;
    XA_percent: string;
    WDA_percent: string;
    X_minus_percent: string;
    S_minus: number;
    P: number;
    X_plus_percent: string;
    Xu_percent: string;
    Zf: number;
    Zd: string | number;
    W_D_Dd: string;
    W_M: string;
    PSV: number;
    DQ_plus: number;
    DQ_v: number;
    COP: number;
    AG: number;
    a_p_inter: string;
    Food: number;
    SumT_inter: number;
    HumanCont: number;
    PureH: number;
    PER: number;
    ISO_Index: string;
    _3r_2_R: string;
    Fr_rF: number;
    SumV_self: number;
    FD: number;
    An_Xy: number;
    MOR_self: number;
    H_ratio: string;
  };
}

function valueClass(value: string | number | undefined | null) {
  const v = value ?? '';
  if (v === 0 || v === '' || v === '-' || v === '0' || v === '0.00') {
    return 'text-slate-300';
  }
  return 'font-semibold text-slate-900';
}

function PairTable({
  rows,
}: {
  rows: Array<{ leftLabel: string; leftValue: string | number; rightLabel?: string; rightValue?: string | number }>;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-[8px] leading-tight">
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <th className="border border-slate-200 bg-slate-50 px-1 py-1 text-left font-normal text-slate-600">{row.leftLabel}</th>
            <td className={`border border-slate-200 px-1 py-1 text-center ${valueClass(row.leftValue)}`}>{row.leftValue}</td>
            {row.rightLabel ? (
              <>
                <th className="border border-slate-200 bg-slate-50 px-1 py-1 text-left font-normal text-slate-600">{row.rightLabel}</th>
                <td className={`border border-slate-200 px-1 py-1 text-center ${valueClass(row.rightValue)}`}>{row.rightValue}</td>
              </>
            ) : (
              <>
                <td className="border-0 bg-white"></td>
                <td className="border-0 bg-white"></td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TripleTable({
  rows,
}: {
  rows: Array<{ label: string; value: string | number; note?: string }>;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-[8px] leading-tight">
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <th className="w-[38%] border border-slate-200 bg-slate-50 px-1 py-1 text-left font-normal text-slate-600">{row.label}</th>
            <td className={`w-[28%] border border-slate-200 px-1 py-1 text-center ${valueClass(row.value)}`}>{row.value}</td>
            <td className="w-[34%] border border-slate-200 px-1 py-1 text-center text-[7px] text-slate-400">{row.note ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SummaryIndicesTable({ specialIndices }: { specialIndices?: SpecialIndicesData }) {
  const items = [
    { label: 'PTI', key: 'PTI' },
    { label: 'DEPI', key: 'DEPI' },
    { label: 'CDI', key: 'CDI' },
    { label: 'S-CON', key: 'SCON' },
    { label: 'HVI', key: 'HVI' },
    { label: 'OBS', key: 'OBS' },
  ] as const;

  return (
    <table className="w-full table-fixed border-collapse text-[8px] leading-tight">
      <tbody>
        {items.map((item) => {
          const raw = specialIndices?.[item.key] ?? '-';
          const [score, result = '-'] = typeof raw === 'string' ? raw.split(', ') : ['-', '-'];
          return (
            <tr key={item.label}>
              <th className="border border-slate-200 bg-slate-50 px-1 py-1 text-left font-normal text-slate-600">{item.label}</th>
              <td className={`border border-slate-200 px-1 py-1 text-center ${valueClass(score)}`}>{score}</td>
              <td className={`border border-slate-200 px-1 py-1 text-center ${result === 'Positive' ? 'font-semibold text-red-600' : 'text-slate-400'}`}>
                {result}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PrintCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <h3 className="border-b border-slate-200 px-2 py-1 text-center text-[9px] font-semibold text-slate-800">{title}</h3>
      <div className="p-1.5">{children}</div>
    </section>
  );
}

export default function PrintLowerSection({ data, specialIndices }: PrintLowerSectionProps) {
  return (
    <div id="Lower_Section_Print" className="grid grid-cols-4 gap-1.5">
      <PrintCard
        title="Core"
      >
        <PairTable
          rows={[
            { leftLabel: 'R', leftValue: data.R, rightLabel: 'Lambda', rightValue: data.Lambda },
            { leftLabel: 'EB', leftValue: data.EB, rightLabel: 'EA', rightValue: data.EA },
            { leftLabel: 'eb', leftValue: data.eb, rightLabel: 'es', rightValue: data.es },
            { leftLabel: 'D', leftValue: data.D, rightLabel: 'Adj D', rightValue: data.AdjD },
            { leftLabel: 'Adj es', leftValue: data.AdjEs, rightLabel: 'EBPer', rightValue: data.EBPer },
            { leftLabel: 'FM', leftValue: data.FM, rightLabel: 'm', rightValue: data.m },
            { leftLabel: "SumC'", leftValue: data.SumCprime, rightLabel: 'SumT', rightValue: data.SumT },
            { leftLabel: 'SumV', leftValue: data.SumV, rightLabel: 'SumY', rightValue: data.SumY },
          ]}
        />
      </PrintCard>

      <PrintCard title="Affection">
        <TripleTable
          rows={[
            { label: 'FC : CF+C', value: data.FC_CF_C },
            { label: 'Pure C', value: data.PureC },
            { label: "SumC' : WSumC", value: data.SumC_WSumC },
            { label: 'Afr', value: data.Afr },
            { label: 'S', value: data.S_aff },
            { label: 'Blends : R', value: data.Blends_R },
            { label: 'CP', value: data.CP },
          ]}
        />
      </PrintCard>

      <PrintCard title="Interpersonal">
        <TripleTable
          rows={[
            { label: 'COP', value: data.COP },
            { label: 'AG', value: data.AG },
            { label: 'a : p', value: data.a_p_inter },
            { label: 'Food', value: data.Food },
            { label: 'SumT', value: data.SumT_inter },
            { label: 'Human Cont', value: data.HumanCont },
            { label: 'Pure H', value: data.PureH },
            { label: 'PER', value: data.PER },
            { label: 'ISO Index', value: data.ISO_Index },
          ]}
        />
      </PrintCard>

      <PrintCard title="Self-Perception">
        <TripleTable
          rows={[
            { label: '3r+(2)/R', value: data._3r_2_R },
            { label: 'Fr+rF', value: data.Fr_rF },
            { label: 'SumV', value: data.SumV_self },
            { label: 'FD', value: data.FD },
            { label: 'An+Xy', value: data.An_Xy },
            { label: 'MOR', value: data.MOR_self },
            { label: 'H:(H)+Hd+(Hd)', value: data.H_ratio },
          ]}
        />
      </PrintCard>

      <PrintCard title="Ideation">
        <PairTable
          rows={[
            { leftLabel: 'a : p', leftValue: data.a_p, rightLabel: 'Sum6', rightValue: data.Sum6 },
            { leftLabel: 'Ma : Mp', leftValue: data.Ma_Mp, rightLabel: 'Lv2', rightValue: data.Lv2 },
            { leftLabel: '2AB+Art+Ay', leftValue: data._2AB_Art_Ay, rightLabel: 'WSum6', rightValue: data.WSum6_ideation },
            { leftLabel: 'MOR', leftValue: data.MOR, rightLabel: 'M-', rightValue: data.M_minus_ideation },
            { leftLabel: 'Mnone', leftValue: data.Mnone },
          ]}
        />
      </PrintCard>

      <PrintCard title="Cognitive Mediation">
        <TripleTable
          rows={[
            { label: 'XA%', value: data.XA_percent },
            { label: 'WDA%', value: data.WDA_percent },
            { label: 'X-%', value: data.X_minus_percent },
            { label: 'S-', value: data.S_minus },
            { label: 'P', value: data.P },
            { label: 'X+%', value: data.X_plus_percent },
            { label: 'Xu%', value: data.Xu_percent },
          ]}
        />
      </PrintCard>

      <PrintCard title="Information Processing">
        <TripleTable
          rows={[
            { label: 'Zf', value: data.Zf },
            { label: 'W : D : Dd', value: data.W_D_Dd },
            { label: 'W : M', value: data.W_M },
            { label: 'Zd', value: data.Zd },
            { label: 'PSV', value: data.PSV },
            { label: 'DQ+', value: data.DQ_plus },
            { label: 'DQv', value: data.DQ_v },
          ]}
        />
      </PrintCard>

      <PrintCard title="Special Indices">
        <SummaryIndicesTable specialIndices={specialIndices} />
      </PrintCard>
    </div>
  );
}
