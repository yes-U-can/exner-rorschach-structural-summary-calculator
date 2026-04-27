'use client';

import { useState } from 'react';
import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import type { Language } from '@/types';

type CopyPageButtonProps = {
  language: Language;
  targetId: string;
  className?: string;
};

const LABELS: Record<Language, { idle: string; done: string }> = {
  en: { idle: 'Copy page text', done: 'Copied' },
  ko: { idle: '페이지 내용 복사', done: '복사됨' },
  ja: { idle: 'ページ内容をコピー', done: 'コピーしました' },
  es: { idle: 'Copiar contenido de la página', done: 'Copiado' },
  pt: { idle: 'Copiar conteúdo da página', done: 'Copiado' },
};

export default function CopyPageButton({ language, targetId, className = '' }: CopyPageButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const text = el.innerText.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const label = copied ? LABELS[language].done : LABELS[language].idle;

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label}
      title={label}
      className={`ui-copy-button h-10 w-10 ${className}`.trim()}
    >
      <span className="sr-only">{label}</span>
      {copied ? <CheckIcon className="h-5 w-5" /> : <Square2StackIcon className="h-5 w-5" />}
    </button>
  );
}
