'use client';

import HeaderNavItem from './HeaderNavItem';
import type { HeaderNavItemConfig } from './types';

type HeaderNavProps = {
  items: HeaderNavItemConfig[];
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  onAuthRequired: () => void;
};

export default function HeaderNav({ items, authStatus, onAuthRequired }: HeaderNavProps) {
  return (
    <nav className="ui-header-nav-scroll" aria-label="Primary">
      <div className="ui-segmented-nav">
        {items.map((item) => (
          <HeaderNavItem
            key={item.href}
            item={item}
            authStatus={authStatus}
            onAuthRequired={onAuthRequired}
          />
        ))}
      </div>
    </nav>
  );
}
