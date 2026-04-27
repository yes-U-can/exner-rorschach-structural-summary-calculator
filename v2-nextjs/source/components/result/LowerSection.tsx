'use client';

interface SpecialIndicesData {
  PTI?: string;
  DEPI?: string;
  CDI?: string;
  SCON?: string;
  HVI?: string;
  OBS?: string;
  [key: string]: unknown;
}

interface LowerSectionProps {
  specialIndices?: SpecialIndicesData;
  printMode?: boolean;
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

/** Zero-value gray-out */
function cellClass(value: string | number | undefined | null): string {
  const v = value ?? '';
  if (v === 0 || v === '' || v === '-' || v === '0' || v === '0.00') {
    return 'bg-[var(--surface-muted)] text-[var(--text-soft)]';
  }
  return 'font-bold';
}

const TH =
  'overflow-hidden whitespace-nowrap border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-1 py-1.5 text-left text-[10px] font-normal text-[var(--text-body)]';
const TD =
  'border border-[var(--border-subtle)] px-2 py-1.5 text-center text-[11px] tabular-nums text-[var(--text-body)]';
const TH_COMPACT =
  'overflow-hidden whitespace-nowrap border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-1 py-1 text-left text-[9px] font-normal text-[var(--text-body)]';
const TD_COMPACT =
  'border border-[var(--border-subtle)] px-1.5 py-1 text-center text-[9px] tabular-nums text-[var(--text-body)]';
const EMPTY_CELL = 'border-0 bg-[var(--surface-base)]';

function GridCard({ title, children, compact = false }: { title: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className="flex flex-col rounded border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-body)]">
      <h3 className={`${compact ? 'py-1 text-[10px]' : 'py-1.5 text-xs'} flex-shrink-0 border-b border-[var(--border-subtle)] text-center font-semibold text-[var(--text-strong)]`}>
        {title}
      </h3>
      <div className={`${compact ? 'p-1' : 'p-1.5'} flex-grow min-w-0`}>
        {children}
      </div>
    </div>
  );
}

/** Simple 2-column table row */
function Row({
  label,
  value,
  thClass,
  tdClass,
}: {
  label: string;
  value: string | number;
  thClass: string;
  tdClass: string;
}) {
  return (
    <tr>
      <th className={thClass}>{label}</th>
      <td className={`${tdClass} ${cellClass(value)}`}>{value}</td>
    </tr>
  );
}

export default function LowerSection({ data, specialIndices, printMode = false }: LowerSectionProps) {
  const thClass = printMode ? TH_COMPACT : TH;
  const tdClass = printMode ? TD_COMPACT : TD;

  return (
    <div
      id="Lower_Section"
      className={printMode ? 'grid gap-1' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'}
      style={printMode ? { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridAutoRows: '1fr' } : undefined}
    >
      {/* Row 1: Core, Affection, Interpersonal, Self-Perception */}

      {/* Core Card - complex 3-column table (matches legacy) */}
      <GridCard title="Core" compact={printMode}>
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: '16%' }} />
            <col style={{ width: '17.33%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '17.33%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '17.33%' }} />
          </colgroup>
          <tbody>
            {/* R, Lambda */}
            <tr>
              <th className={thClass}>R</th>
              <td className={`${tdClass} ${cellClass(data.R)}`}>{data.R}</td>
              <th className={thClass}>Lambda</th>
              <td className={`${tdClass} ${cellClass(data.Lambda)}`}>{data.Lambda}</td>
              <td className={EMPTY_CELL} colSpan={2}></td>
            </tr>
            {/* EB, EA, EBPer */}
            <tr>
              <th className={thClass}>EB</th>
              <td className={`${tdClass} ${cellClass(data.EB)}`}>{data.EB}</td>
              <th className={thClass}>EA</th>
              <td className={`${tdClass} ${cellClass(data.EA)}`}>{data.EA}</td>
              <th className={thClass}>EBPer</th>
              <td className={`${tdClass} ${cellClass(data.EBPer)}`}>{data.EBPer}</td>
            </tr>
            {/* eb, es, D */}
            <tr>
              <th className={thClass}>eb</th>
              <td className={`${tdClass} ${cellClass(data.eb)}`}>{data.eb}</td>
              <th className={thClass}>es</th>
              <td className={`${tdClass} ${cellClass(data.es)}`}>{data.es}</td>
              <th className={thClass}>D</th>
              <td className={`${tdClass} ${cellClass(data.D)}`}>{data.D}</td>
            </tr>
            {/* (empty), Adj es, Adj D */}
            <tr>
              <td className={EMPTY_CELL} colSpan={2}></td>
              <th className={thClass}>Adj es</th>
              <td className={`${tdClass} ${cellClass(data.AdjEs)}`}>{data.AdjEs}</td>
              <th className={thClass}>Adj D</th>
              <td className={`${tdClass} ${cellClass(data.AdjD)}`}>{data.AdjD}</td>
            </tr>
            {/* FM, SumC', SumT */}
            <tr>
              <th className={thClass}>FM</th>
              <td className={`${tdClass} ${cellClass(data.FM)}`}>{data.FM}</td>
              <th className={thClass}>SumC&apos;</th>
              <td className={`${tdClass} ${cellClass(data.SumCprime)}`}>{data.SumCprime}</td>
              <th className={thClass}>SumT</th>
              <td className={`${tdClass} ${cellClass(data.SumT)}`}>{data.SumT}</td>
            </tr>
            {/* m, SumV, SumY */}
            <tr>
              <th className={thClass}>m</th>
              <td className={`${tdClass} ${cellClass(data.m)}`}>{data.m}</td>
              <th className={thClass}>SumV</th>
              <td className={`${tdClass} ${cellClass(data.SumV)}`}>{data.SumV}</td>
              <th className={thClass}>SumY</th>
              <td className={`${tdClass} ${cellClass(data.SumY)}`}>{data.SumY}</td>
            </tr>
          </tbody>
        </table>
      </GridCard>

      {/* Affection Card */}
      <GridCard title="Affection" compact={printMode}>
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="FC : CF+C" value={data.FC_CF_C} thClass={thClass} tdClass={tdClass} />
            <Row label="Pure C" value={data.PureC} thClass={thClass} tdClass={tdClass} />
            <Row label="SumC' : WSumC" value={data.SumC_WSumC} thClass={thClass} tdClass={tdClass} />
            <Row label="Afr" value={data.Afr} thClass={thClass} tdClass={tdClass} />
            <Row label="S" value={data.S_aff} thClass={thClass} tdClass={tdClass} />
            <Row label="Blends : R" value={data.Blends_R} thClass={thClass} tdClass={tdClass} />
            <Row label="CP" value={data.CP} thClass={thClass} tdClass={tdClass} />
          </tbody>
        </table>
      </GridCard>

      {/* Interpersonal Card */}
      <GridCard title="Interpersonal" compact={printMode}>
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="COP" value={data.COP} thClass={thClass} tdClass={tdClass} />
            <Row label="AG" value={data.AG} thClass={thClass} tdClass={tdClass} />
            <Row label="a : p" value={data.a_p_inter} thClass={thClass} tdClass={tdClass} />
            <Row label="Food" value={data.Food} thClass={thClass} tdClass={tdClass} />
            <Row label="SumT" value={data.SumT_inter} thClass={thClass} tdClass={tdClass} />
            <Row label="Human Cont" value={data.HumanCont} thClass={thClass} tdClass={tdClass} />
            <Row label="Pure H" value={data.PureH} thClass={thClass} tdClass={tdClass} />
            <Row label="PER" value={data.PER} thClass={thClass} tdClass={tdClass} />
            <Row label="ISO Index" value={data.ISO_Index} thClass={thClass} tdClass={tdClass} />
          </tbody>
        </table>
      </GridCard>

      {/* Self-Perception Card */}
      <GridCard title="Self-Perception" compact={printMode}>
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="3r+(2)/R" value={data._3r_2_R} thClass={thClass} tdClass={tdClass} />
            <Row label="Fr+rF" value={data.Fr_rF} thClass={thClass} tdClass={tdClass} />
            <Row label="SumV" value={data.SumV_self} thClass={thClass} tdClass={tdClass} />
            <Row label="FD" value={data.FD} thClass={thClass} tdClass={tdClass} />
            <Row label="An+Xy" value={data.An_Xy} thClass={thClass} tdClass={tdClass} />
            <Row label="MOR" value={data.MOR_self} thClass={thClass} tdClass={tdClass} />
            <Row label="H : (H)+Hd+(Hd)" value={data.H_ratio} thClass={thClass} tdClass={tdClass} />
          </tbody>
        </table>
      </GridCard>

      {/* Row 2: Ideation, Cognitive Mediation, Information Processing, Special Indices */}

      {/* Ideation Card - 4-column table (matches legacy) */}
      <GridCard title="Ideation" compact={printMode}>
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <tbody>
            <tr>
              <th className={thClass}>a : p</th>
              <td className={`${tdClass} ${cellClass(data.a_p)}`}>{data.a_p}</td>
              <th className={thClass}>Sum6</th>
              <td className={`${tdClass} ${cellClass(data.Sum6)}`}>{data.Sum6}</td>
            </tr>
            <tr>
              <th className={thClass}>Ma : Mp</th>
              <td className={`${tdClass} ${cellClass(data.Ma_Mp)}`}>{data.Ma_Mp}</td>
              <th className={thClass}>Lv2</th>
              <td className={`${tdClass} ${cellClass(data.Lv2)}`}>{data.Lv2}</td>
            </tr>
            <tr>
              <th className={thClass}>2AB+Art+Ay</th>
              <td className={`${tdClass} ${cellClass(data._2AB_Art_Ay)}`}>{data._2AB_Art_Ay}</td>
              <th className={thClass}>WSum6</th>
              <td className={`${tdClass} ${cellClass(data.WSum6_ideation)}`}>{data.WSum6_ideation}</td>
            </tr>
            <tr>
              <th className={thClass}>MOR</th>
              <td className={`${tdClass} ${cellClass(data.MOR)}`}>{data.MOR}</td>
              <th className={thClass}>M-</th>
              <td className={`${tdClass} ${cellClass(data.M_minus_ideation)}`}>{data.M_minus_ideation}</td>
            </tr>
            <tr>
              <td className={EMPTY_CELL} colSpan={2}></td>
              <th className={thClass}>Mnone</th>
              <td className={`${tdClass} ${cellClass(data.Mnone)}`}>{data.Mnone}</td>
            </tr>
          </tbody>
        </table>
      </GridCard>

      {/* Cognitive Mediation Card */}
      <GridCard title="Cognitive Mediation" compact={printMode}>
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="XA%" value={data.XA_percent} thClass={thClass} tdClass={tdClass} />
            <Row label="WDA%" value={data.WDA_percent} thClass={thClass} tdClass={tdClass} />
            <Row label="X-%" value={data.X_minus_percent} thClass={thClass} tdClass={tdClass} />
            <Row label="S-" value={data.S_minus} thClass={thClass} tdClass={tdClass} />
            <Row label="P" value={data.P} thClass={thClass} tdClass={tdClass} />
            <Row label="X+%" value={data.X_plus_percent} thClass={thClass} tdClass={tdClass} />
            <Row label="Xu%" value={data.Xu_percent} thClass={thClass} tdClass={tdClass} />
          </tbody>
        </table>
      </GridCard>

      {/* Information Processing Card */}
      <GridCard title="Information Processing" compact={printMode}>
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="Zf" value={data.Zf} thClass={thClass} tdClass={tdClass} />
            <Row label="W : D : Dd" value={data.W_D_Dd} thClass={thClass} tdClass={tdClass} />
            <Row label="W : M" value={data.W_M} thClass={thClass} tdClass={tdClass} />
            <Row label="Zd" value={data.Zd} thClass={thClass} tdClass={tdClass} />
            <Row label="PSV" value={data.PSV} thClass={thClass} tdClass={tdClass} />
            <Row label="DQ+" value={data.DQ_plus} thClass={thClass} tdClass={tdClass} />
            <Row label="DQv" value={data.DQ_v} thClass={thClass} tdClass={tdClass} />
          </tbody>
        </table>
      </GridCard>

      {/* Special Indices Summary Card - 3-column row */}
      <GridCard title="Special Indices" compact={printMode}>
        <SpecialIndicesSummary specialIndices={specialIndices} />
      </GridCard>
    </div>
  );
}

/** Special Indices summary: 3-column (Label, Score, Result) */
function SpecialIndicesSummary({ specialIndices }: { specialIndices?: SpecialIndicesData }) {
  const indices = [
    { name: 'PTI', key: 'PTI' },
    { name: 'DEPI', key: 'DEPI' },
    { name: 'CDI', key: 'CDI' },
    { name: 'S-CON', key: 'SCON' },
    { name: 'HVI', key: 'HVI' },
    { name: 'OBS', key: 'OBS' },
  ];

  return (
    <table className="w-full table-fixed border-collapse">
      <tbody>
        {indices.map(({ name, key }) => {
          const raw = specialIndices?.[key] || '';
          const [score, result] = typeof raw === 'string' ? raw.split(', ') : ['-', ''];
          const isPositive = result === 'Positive';
          return (
            <tr key={name}>
              <th className={TH}>{name}</th>
              <td className={`${TD} ${cellClass(score)}`}>{score}</td>
              <td className={`${TD} text-[10px] ${
                isPositive
                  ? 'bg-[var(--danger-hover-bg)] font-bold text-[var(--danger-text)]'
                  : 'text-[var(--text-soft)]'
              }`}>
                {isPositive ? 'Positive' : result || '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
