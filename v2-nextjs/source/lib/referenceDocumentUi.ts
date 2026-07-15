import type { Language } from '@/types';

type ReferenceDocumentUi = {
  copy: string;
  copiedTitle: string;
  copiedMessage: string;
  copyFailedTitle: string;
  copyFailedMessage: string;
};

const REFERENCE_DOCUMENT_UI: Record<Language, ReferenceDocumentUi> = {
  en: {
    copy: 'Copy',
    copiedTitle: 'Copied',
    copiedMessage: 'Reference document copied to the clipboard.',
    copyFailedTitle: 'Copy failed',
    copyFailedMessage: 'Could not copy the text. Please copy it manually.',
  },
  ko: {
    copy: '복사',
    copiedTitle: '복사됨',
    copiedMessage: '참조 문서를 클립보드에 복사했습니다.',
    copyFailedTitle: '복사 실패',
    copyFailedMessage: '텍스트를 복사하지 못했습니다. 직접 복사해 주세요.',
  },
  ja: {
    copy: 'コピー',
    copiedTitle: 'コピーしました',
    copiedMessage: '参照文書をクリップボードにコピーしました。',
    copyFailedTitle: 'コピーに失敗しました',
    copyFailedMessage: 'テキストをコピーできませんでした。手動でコピーしてください。',
  },
  es: {
    copy: 'Copiar',
    copiedTitle: 'Copiado',
    copiedMessage: 'El documento de referencia se copió al portapapeles.',
    copyFailedTitle: 'No se pudo copiar',
    copyFailedMessage: 'No se pudo copiar el texto. Cópialo manualmente.',
  },
  pt: {
    copy: 'Copiar',
    copiedTitle: 'Copiado',
    copiedMessage: 'O documento de referência foi copiado para a área de transferência.',
    copyFailedTitle: 'Falha ao copiar',
    copyFailedMessage: 'Não foi possível copiar o texto. Copie-o manualmente.',
  },
};

export function getReferenceDocumentUi(language: string): ReferenceDocumentUi {
  return REFERENCE_DOCUMENT_UI[(language as Language) in REFERENCE_DOCUMENT_UI
    ? (language as Language)
    : 'en'];
}
