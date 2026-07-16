'use client';

import { Fragment, type ReactNode, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CommandLineIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { clearAllEphemeralChatStorage } from '@/lib/ephemeralChatStorage';
import { getAppShellUi } from '@/lib/appShellUi';
import {
  clearByokSession,
  fetchByokSessionStatus,
  getCachedByokSessionStatus,
  openByokSessionDialog,
  subscribeByokSessionChange,
  type ByokSessionStatus,
} from '@/lib/byokSessionClient';
import LanguageSelector from '@/components/layout/LanguageSelector';
import ThemeToggle from '@/components/layout/ThemeToggle';
import KeyboardShortcutsDialog from '@/components/layout/KeyboardShortcutsDialog';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { getAppShortcutAction, isEditableShortcutTarget } from '@/lib/appShortcuts';
import { getKeyboardShortcutsUi } from '@/lib/keyboardShortcutsUi';

const APP_VERSION = '2.2.2';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type SidebarLink = {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  requiresAuth?: boolean;
  prefetch?: boolean;
};

type SidebarContentProps = {
  mobile: boolean;
  collapsed: boolean;
  authStatus: AuthStatus;
  navigationLinks: SidebarLink[];
  onCloseMobile: () => void;
  onCollapse: () => void;
  onRequireAuth: () => void;
  onOpenSession: () => void;
  onOpenShortcuts: () => void;
  onLogout: () => void;
};

function SidebarItem({
  item,
  collapsed,
  authStatus,
  onNavigate,
  onRequireAuth,
}: {
  item: SidebarLink;
  collapsed: boolean;
  authStatus: AuthStatus;
  onNavigate: () => void;
  onRequireAuth: () => void;
}) {
  const isBlocked = item.requiresAuth && authStatus === 'unauthenticated';
  const isPending = item.requiresAuth && authStatus === 'loading';
  const className = `ui-app-nav-item ${item.active ? 'is-active' : ''} ${collapsed ? 'is-icon-only' : ''}`;
  const content = (
    <>
      <span className="ui-app-nav-icon" aria-hidden="true">{item.icon}</span>
      <span className="ui-app-nav-label">{item.label}</span>
    </>
  );

  if (isBlocked || isPending) {
    return (
      <button
        type="button"
        className={className}
        title={item.label}
        aria-label={collapsed ? item.label : undefined}
        aria-disabled={isPending}
        onClick={() => {
          if (isBlocked) onRequireAuth();
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      prefetch={item.prefetch}
      className={className}
      title={item.label}
      aria-label={collapsed ? item.label : undefined}
      aria-current={item.active ? 'page' : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

function SidebarActionItem({
  label,
  collapsed,
  icon,
  onClick,
}: {
  label: string;
  collapsed: boolean;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`ui-app-nav-item ${collapsed ? 'is-icon-only' : ''}`}
      title={label}
      aria-label={collapsed ? label : undefined}
      onClick={onClick}
    >
      <span className="ui-app-nav-icon" aria-hidden="true">{icon}</span>
      <span className="ui-app-nav-label">{label}</span>
    </button>
  );
}

function SidebarContent({
  mobile,
  collapsed,
  authStatus,
  navigationLinks,
  onCloseMobile,
  onCollapse,
  onRequireAuth,
  onOpenSession,
  onOpenShortcuts,
  onLogout,
}: SidebarContentProps) {
  const { t, language } = useTranslation();
  const ui = getAppShellUi(language);
  const shortcutsUi = getKeyboardShortcutsUi(language);
  const isCompact = collapsed && !mobile;

  return (
    <div className={`ui-app-sidebar-content ${mobile ? 'ui-app-sidebar-mobile' : ''}`}>
      <div className={`ui-app-sidebar-header ${mobile ? 'is-mobile' : ''} ${isCompact ? 'is-compact' : ''}`}>
        {mobile ? (
          <button
            type="button"
            className="ui-app-icon-button"
            onClick={onCloseMobile}
            aria-label={ui.closeMenu}
            title={ui.closeMenu}
            aria-keyshortcuts="Control+B Meta+B"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="ui-app-icon-button"
            onClick={onCollapse}
            aria-label={isCompact ? ui.expandSidebar : ui.collapseSidebar}
            title={isCompact ? ui.expandSidebar : ui.collapseSidebar}
            aria-keyshortcuts="Control+B Meta+B"
          >
            {isCompact ? (
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <nav className="ui-app-sidebar-section" aria-label={ui.workspace}>
        <div className="ui-app-sidebar-list">
          {navigationLinks.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              collapsed={isCompact}
              authStatus={authStatus}
              onNavigate={onCloseMobile}
              onRequireAuth={onRequireAuth}
            />
          ))}
          <SidebarActionItem
            label={shortcutsUi.title}
            collapsed={isCompact}
            icon={<CommandLineIcon className="h-5 w-5" />}
            onClick={onOpenShortcuts}
          />
        </div>
      </nav>

      <div className="ui-app-sidebar-spacer" />

      <div className={`ui-app-sidebar-bottom ${isCompact ? 'is-compact' : ''}`}>
        <section className="ui-app-sidebar-section" aria-label={ui.settings}>
          <div className={`ui-app-preferences ${isCompact ? 'is-compact' : ''}`}>
            <LanguageSelector variant="sidebar" compact={isCompact} />
            <ThemeToggle compact={isCompact} />
          </div>
        </section>

        <section className="ui-app-sidebar-section" aria-label={ui.aiSession}>
          {authStatus === 'loading' ? (
            <div className={`ui-app-session-skeleton ${isCompact ? 'is-icon-only' : ''}`} />
          ) : authStatus === 'authenticated' ? (
            <button
              type="button"
              className={`ui-app-session-button ${isCompact ? 'is-icon-only' : ''}`}
              onClick={onLogout}
              title={t('nav.logout')}
              aria-label={isCompact ? t('nav.logout') : undefined}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="ui-app-session-label">{t('nav.logout')}</span>
            </button>
          ) : (
            <button
              type="button"
              className={`ui-app-session-button ${isCompact ? 'is-icon-only' : ''}`}
              onClick={onOpenSession}
              title={t('nav.login')}
              aria-label={isCompact ? t('nav.login') : undefined}
            >
              <KeyIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="ui-app-session-label">{t('nav.login')}</span>
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { t, language } = useTranslation();
  const { showToast } = useToast();
  const pathname = usePathname();
  const ui = getAppShellUi(language);
  const cachedStatus = getCachedByokSessionStatus();
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus>(cachedStatus ?? {
    active: false,
    provider: null,
    masked: null,
    expiresAt: null,
    ttlHours: 24,
  });
  const [isCheckingSession, setIsCheckingSession] = useState(!cachedStatus);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  const authStatus: AuthStatus = isCheckingSession
    ? 'loading'
    : byokStatus.active
      ? 'authenticated'
      : 'unauthenticated';

  const refreshByokStatus = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading) setIsCheckingSession(true);
    try {
      const nextStatus = await fetchByokSessionStatus();
      if (!nextStatus.active) clearAllEphemeralChatStorage();
      setByokStatus(nextStatus);
    } finally {
      setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    void refreshByokStatus({ showLoading: !getCachedByokSessionStatus() });
    return subscribeByokSessionChange(() => {
      void refreshByokStatus();
    });
  }, [refreshByokStatus]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const closeMobileNavigation = useCallback(() => {
    setIsMobileOpen(false);
  }, []);
  const openSession = useCallback(() => {
    closeMobileNavigation();
    openByokSessionDialog({ source: 'sidebar' });
  }, [closeMobileNavigation]);
  const requireAuth = useCallback(() => {
    closeMobileNavigation();
    openByokSessionDialog({ source: 'sidebar' });
    showToast({
      type: 'error',
      title: t('nav.loginRequired'),
      message: t('nav.aiGuide'),
    });
  }, [closeMobileNavigation, showToast, t]);
  const openShortcuts = useCallback(() => {
    closeMobileNavigation();
    setIsShortcutsOpen(true);
  }, [closeMobileNavigation]);
  const requestLogout = useCallback(() => {
    closeMobileNavigation();
    setIsLogoutConfirmOpen(true);
  }, [closeMobileNavigation]);
  const logout = async () => {
    setIsEndingSession(true);
    try {
      clearAllEphemeralChatStorage();
      await clearByokSession();
      await refreshByokStatus();
      setIsLogoutConfirmOpen(false);
    } finally {
      setIsEndingSession(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDesktopCollapsed) {
        event.preventDefault();
        setIsDesktopCollapsed(true);
        return;
      }

      const action = getAppShortcutAction(event, {
        isEditableTarget: isEditableShortcutTarget(event.target),
      });
      if (!action || isShortcutsOpen) return;

      event.preventDefault();

      if (action === 'toggle-sidebar') {
        if (window.matchMedia('(min-width: 1024px)').matches) {
          setIsDesktopCollapsed((current) => !current);
        } else {
          setIsMobileOpen((current) => !current);
        }
        return;
      }

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isDesktopCollapsed,
    isShortcutsOpen,
  ]);

  const scoringHref = `/?lang=${language}`;
  const navigationLinks: SidebarLink[] = [
    {
      href: scoringHref,
      label: t('nav.scoring'),
      icon: <CalculatorIcon className="h-5 w-5" />,
      active: pathname === '/',
    },
    {
      href: `/chat?lang=${language}`,
      label: t('nav.aiChatTop'),
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
      active: pathname === '/chat',
      requiresAuth: true,
    },
    {
      href: `/ref?lang=${language}`,
      label: t('nav.referenceDocuments'),
      icon: <BookOpenIcon className="h-5 w-5" />,
      active: pathname === '/ref' || pathname.startsWith('/ref/'),
    },
    {
      href: `/about?lang=${language}`,
      label: ui.about,
      icon: <InformationCircleIcon className="h-5 w-5" />,
      active: pathname === '/about',
    },
    {
      href: `/terms?lang=${language}`,
      label: ui.terms,
      icon: <DocumentTextIcon className="h-5 w-5" />,
      active: pathname === '/terms',
    },
    {
      href: `/privacy?lang=${language}`,
      label: ui.privacy,
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      active: pathname === '/privacy' || pathname.startsWith('/privacy/'),
    },
    {
      href: `/versions?lang=${language}`,
      label: `${ui.version} ${APP_VERSION}`,
      icon: <ClockIcon className="h-5 w-5" />,
      active: pathname === '/versions',
      prefetch: false,
    },
  ];
  const sidebarProps: SidebarContentProps = {
    mobile: false,
    collapsed: true,
    authStatus,
    navigationLinks,
    onCloseMobile: closeMobileNavigation,
    onCollapse: () => setIsDesktopCollapsed((current) => !current),
    onRequireAuth: requireAuth,
    onOpenSession: openSession,
    onOpenShortcuts: openShortcuts,
    onLogout: requestLogout,
  };

  return (
    <div className="ui-app-shell">
      <button
        type="button"
        className={`ui-app-desktop-backdrop print:hidden ${isDesktopCollapsed ? '' : 'is-visible'}`}
        onClick={() => setIsDesktopCollapsed(true)}
        aria-label={ui.closeMenu}
        aria-hidden={isDesktopCollapsed}
        tabIndex={-1}
      />

      <aside
        className={`ui-app-sidebar print:hidden ${isDesktopCollapsed ? 'is-collapsed' : 'is-expanded'}`}
        aria-label={ui.sidebarLabel}
      >
        <SidebarContent
          {...sidebarProps}
          collapsed={isDesktopCollapsed}
        />
      </aside>

      <div className="ui-app-shell-main" inert={!isDesktopCollapsed}>
        <header className="ui-app-mobile-bar print:hidden">
          <button
            type="button"
            className="ui-app-icon-button"
            onClick={() => setIsMobileOpen(true)}
            aria-label={ui.openMenu}
            title={ui.openMenu}
            aria-expanded={isMobileOpen}
            aria-keyshortcuts="Control+B Meta+B"
          >
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="ui-app-shell-content">{children}</div>
      </div>

      <Transition appear show={isMobileOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[14000] print:hidden lg:hidden"
          onClose={setIsMobileOpen}
          aria-label={ui.sidebarLabel}
        >
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-[cubic-bezier(0.4,0,0.2,1)] duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-[cubic-bezier(0.4,0,0.2,1)] duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[var(--surface-overlay)]" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-hidden">
            <TransitionChild
              as={Fragment}
              enter="transform transition-transform ease-[cubic-bezier(0.4,0,0.2,1)] duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition-transform ease-[cubic-bezier(0.4,0,0.2,1)] duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="ui-app-drawer">
                <SidebarContent
                  {...sidebarProps}
                  mobile
                  collapsed={false}
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      <KeyboardShortcutsDialog
        open={isShortcutsOpen}
        language={language}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <Modal
        isOpen={isLogoutConfirmOpen}
        onClose={() => {
          if (!isEndingSession) setIsLogoutConfirmOpen(false);
        }}
        title={ui.endSessionTitle}
        size="sm"
        showCloseButton={false}
      >
        <p className="text-sm leading-6 text-[var(--text-body)]">
          {ui.endSessionDescription}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={isEndingSession}
            onClick={() => setIsLogoutConfirmOpen(false)}
          >
            {ui.endSessionCancel}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={isEndingSession}
            onClick={() => void logout()}
          >
            {ui.endSessionConfirm}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
