'use client';

import SlotSelect from './SlotSelect';
import { OPTIONS } from '@/lib/options';

interface SpecialScoreSlotsProps {
  values: string[];
  onChange: (values: string[]) => void;
  maxSlots?: number;
}

export default function SpecialScoreSlots({ values, onChange, maxSlots = 8 }: SpecialScoreSlotsProps) {
  const handleChange = (index: number, value: string) => {
    const full = Array.from({ length: maxSlots }, (_, i) => values[i] || '');
    full[index] = value;
    const compacted = full.filter(v => v !== '');
    onChange(compacted.length > 0 ? compacted : ['']);
  };

  return (
    <div className="grid w-full min-w-[18.75rem] grid-cols-4 place-items-center gap-1">
      {Array.from({ length: maxSlots }).map((_, index) => (
        <SlotSelect
          key={index}
          value={values[index] || ''}
          onChange={(value) => handleChange(index, value)}
          options={OPTIONS.SPECIAL_SCORES}
          className="w-[4.5rem]"
          gridCols={4}
          placeholder=""
        />
      ))}
    </div>
  );
}
