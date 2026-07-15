import type { Language } from '@/types';

type AppShellUi = {
  sidebarLabel: string;
  workspace: string;
  aiSession: string;
  settings: string;
  openMenu: string;
  closeMenu: string;
  collapseSidebar: string;
  expandSidebar: string;
  about: string;
  terms: string;
  privacy: string;
  version: string;
  endSessionTitle: string;
  endSessionDescription: string;
  endSessionCancel: string;
  endSessionConfirm: string;
};

const COPY: Record<Language, AppShellUi> = {
  ko: {
    sidebarLabel: '주요 메뉴',
    workspace: '작업공간',
    aiSession: 'AI 세션',
    settings: '설정',
    openMenu: '메뉴 열기',
    closeMenu: '메뉴 닫기',
    collapseSidebar: '사이드바 접기',
    expandSidebar: '사이드바 펼치기',
    about: '서비스 소개',
    terms: '이용약관',
    privacy: '개인정보처리방침',
    version: '버전',
    endSessionTitle: 'AI 세션을 종료할까요?',
    endSessionDescription: 'API 키 세션과 임시 AI 대화 내용이 이 브라우저에서 삭제됩니다.',
    endSessionCancel: '취소',
    endSessionConfirm: 'AI 세션 종료',
  },
  en: {
    sidebarLabel: 'Main menu',
    workspace: 'Workspace',
    aiSession: 'AI session',
    settings: 'Settings',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    about: 'About',
    terms: 'Terms',
    privacy: 'Privacy',
    version: 'Version',
    endSessionTitle: 'End the AI session?',
    endSessionDescription: 'The API key session and temporary AI conversations will be removed from this browser.',
    endSessionCancel: 'Cancel',
    endSessionConfirm: 'End AI session',
  },
  ja: {
    sidebarLabel: 'メインメニュー',
    workspace: 'ワークスペース',
    aiSession: 'AIセッション',
    settings: '設定',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    collapseSidebar: 'サイドバーを折りたたむ',
    expandSidebar: 'サイドバーを展開する',
    about: 'サービス紹介',
    terms: '利用規約',
    privacy: 'プライバシー',
    version: 'バージョン',
    endSessionTitle: 'AIセッションを終了しますか？',
    endSessionDescription: 'APIキーのセッションと一時的なAI会話がこのブラウザから削除されます。',
    endSessionCancel: 'キャンセル',
    endSessionConfirm: 'AIセッションを終了',
  },
  es: {
    sidebarLabel: 'Menú principal',
    workspace: 'Espacio de trabajo',
    aiSession: 'Sesión de IA',
    settings: 'Ajustes',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    collapseSidebar: 'Contraer barra lateral',
    expandSidebar: 'Expandir barra lateral',
    about: 'Acerca de',
    terms: 'Términos',
    privacy: 'Privacidad',
    version: 'Versión',
    endSessionTitle: '¿Finalizar la sesión de IA?',
    endSessionDescription: 'La sesión de la API key y las conversaciones temporales con la IA se eliminarán de este navegador.',
    endSessionCancel: 'Cancelar',
    endSessionConfirm: 'Finalizar sesión',
  },
  pt: {
    sidebarLabel: 'Menu principal',
    workspace: 'Área de trabalho',
    aiSession: 'Sessão de IA',
    settings: 'Definições',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    collapseSidebar: 'Recolher barra lateral',
    expandSidebar: 'Expandir barra lateral',
    about: 'Sobre',
    terms: 'Termos',
    privacy: 'Privacidade',
    version: 'Versão',
    endSessionTitle: 'Encerrar a sessão de IA?',
    endSessionDescription: 'A sessão da API key e as conversas temporárias com a IA serão removidas deste navegador.',
    endSessionCancel: 'Cancelar',
    endSessionConfirm: 'Encerrar sessão',
  },
};

export function getAppShellUi(language: Language): AppShellUi {
  return COPY[language] ?? COPY.ko;
}
