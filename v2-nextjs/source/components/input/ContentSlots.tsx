'use client';

import SlotSelect from './SlotSelect';
import { OPTIONS } from '@/lib/options';

interface ContentSlotsProps {
  values: string[];
  onChange: (values: string[]) => void;
  maxSlots?: number;
}

export default function ContentSlots({ values, onChange, maxSlots = 6 }: ContentSlotsProps) {
  const handleChange = (index: number, value: string) => {
    const full = Array.from({ length: maxSlots }, (_, i) => values[i] || '');
    full[index] = value;
    const compacted = full.filter(v => v !== '');
    onChange(compacted.length > 0 ? compacted : ['']);
  };

  return (
    <div className="grid w-full min-w-[9.5rem] grid-cols-3 place-items-center gap-1">
      {Array.from({ length: maxSlots }).map((_, index) => (
        <SlotSelect
          key={index}
          value={values[index] || ''}
          onChange={(value) => handleChange(index, value)}
          options={OPTIONS.CONTENTS}
          className="w-12"
          gridCols={6}
          placeholder=""
        />
      ))}
    </div>
  );
}
