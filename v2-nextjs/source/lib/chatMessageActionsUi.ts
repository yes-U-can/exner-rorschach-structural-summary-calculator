import type { Language } from '@/types';

type ChatMessageActionsUi = {
  copy: string;
  copied: string;
  copyFailed: string;
  helpful: string;
  unhelpful: string;
  feedbackSaved: string;
  feedbackRemoved: string;
  feedbackFailed: string;
  jumpToLatest: string;
};

const CHAT_MESSAGE_ACTIONS_UI: Record<Language, ChatMessageActionsUi> = {
  ko: {
    copy: '메시지 복사',
    copied: '복사됨',
    copyFailed: '복사하지 못했습니다',
    helpful: '도움이 됐어요',
    unhelpful: '도움이 되지 않았어요',
    feedbackSaved: '의견이 저장되었습니다',
    feedbackRemoved: '의견이 취소되었습니다',
    feedbackFailed: '의견을 저장하지 못했습니다',
    jumpToLatest: '최신 메시지로 이동',
  },
  en: {
    copy: 'Copy message',
    copied: 'Copied',
    copyFailed: 'Could not copy',
    helpful: 'Helpful',
    unhelpful: 'Not helpful',
    feedbackSaved: 'Feedback saved',
    feedbackRemoved: 'Feedback removed',
    feedbackFailed: 'Could not save feedback',
    jumpToLatest: 'Jump to latest message',
  },
  ja: {
    copy: 'メッセージをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできませんでした',
    helpful: '役に立った',
    unhelpful: '役に立たなかった',
    feedbackSaved: 'フィードバックを保存しました',
    feedbackRemoved: 'フィードバックを取り消しました',
    feedbackFailed: 'フィードバックを保存できませんでした',
    jumpToLatest: '最新のメッセージへ移動',
  },
  es: {
    copy: 'Copiar mensaje',
    copied: 'Copiado',
    copyFailed: 'No se pudo copiar',
    helpful: 'Útil',
    unhelpful: 'No fue útil',
    feedbackSaved: 'Opinión guardada',
    feedbackRemoved: 'Opinión eliminada',
    feedbackFailed: 'No se pudo guardar la opinión',
    jumpToLatest: 'Ir al mensaje más reciente',
  },
  pt: {
    copy: 'Copiar mensagem',
    copied: 'Copiado',
    copyFailed: 'Não foi possível copiar',
    helpful: 'Útil',
    unhelpful: 'Não foi útil',
    feedbackSaved: 'Opinião salva',
    feedbackRemoved: 'Opinião removida',
    feedbackFailed: 'Não foi possível salvar a opinião',
    jumpToLatest: 'Ir para a mensagem mais recente',
  },
};

export function getChatMessageActionsUi(language: string): ChatMessageActionsUi {
  return CHAT_MESSAGE_ACTIONS_UI[(language as Language) in CHAT_MESSAGE_ACTIONS_UI
    ? (language as Language)
    : 'en'];
}
