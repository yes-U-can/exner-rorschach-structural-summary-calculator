'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { clearAllEphemeralChatStorage } from '@/lib/ephemeralChatStorage';
import {
  clearByokSession,
  fetchByokSessionStatus,
  getCachedByokSessionStatus,
  openByokSessionDialog,
  subscribeByokSessionChange,
  type ByokSessionStatus,
} from '@/lib/byokSessionClient';
import HeaderAuthControls from './header/HeaderAuthControls';
import HeaderNav from './header/HeaderNav';
import HeaderUtilityBar from './header/HeaderUtilityBar';
import type { HeaderNavItemConfig } from './header/types';

export default function Header() {
  const { t, language } = useTranslation();
  const { showToast } = useToast();
  const pathname = usePathname();
  const cachedStatus = getCachedByokSessionStatus();
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus>(cachedStatus ?? {
    active: false,
    provider: null,
    masked: null,
    expiresAt: null,
    ttlHours: 24,
  });
  const [isCheckingSession, setIsCheckingSession] = useState(!cachedStatus);

  const isHome = pathname === '/';
  const authStatus = isCheckingSession ? 'loading' : byokStatus.active ? 'authenticated' : 'unauthenticated';

  const refreshByokStatus = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading) {
      setIsCheckingSession(true);
    }
    try {
      const nextStatus = await fetchByokSessionStatus();
      if (!nextStatus.active) {
        clearAllEphemeralChatStorage();
      }
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

  const navItems: HeaderNavItemConfig[] = [
    {
      href: `/?lang=${language}`,
      label: t('nav.home'),
      active: isHome,
      icon: <HomeIcon className="h-4 w-4" />,
      iconOnly: true,
    },
    {
      href: `/chat?lang=${language}`,
      label: t('nav.aiChatTop'),
      active: pathname === '/chat',
      requiresAuth: true,
    },
    {
      href: `/ref?lang=${language}`,
      label: t('nav.referenceDocuments'),
      active: pathname === '/ref' || pathname.startsWith('/ref/'),
    },
  ];

  return (
    <header className="relative z-[1000] print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <HeaderNav
              items={navItems}
              authStatus={authStatus}
              onAuthRequired={() => {
                openByokSessionDialog({ source: 'header' });
                showToast({
                  type: 'error',
                  title: t('nav.loginRequired'),
                  message: t('nav.aiGuide'),
                });
              }}
            />

            <HeaderAuthControls
              status={authStatus}
              byokStatus={byokStatus}
              startLabel={t('nav.login')}
              logoutLabel={t('nav.logout')}
              onStartSession={() => openByokSessionDialog({ source: 'header' })}
              onChangeSession={() => openByokSessionDialog({ source: 'header' })}
              onLogout={async () => {
                clearAllEphemeralChatStorage();
                await clearByokSession();
                await refreshByokStatus();
              }}
            />
          </div>

          <HeaderUtilityBar
            introLine1={t('nav.homeIntroLine1')}
            introLine2={t('nav.homeIntroLine2')}
          />
        </div>
      </div>
    </header>
  );
}
