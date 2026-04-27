'use client';

import Link from 'next/link';
import type { HeaderNavItemConfig } from './types';

type HeaderNavItemProps = {
  item: HeaderNavItemConfig;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  onAuthRequired: () => void;
};

export default function HeaderNavItem({ item, authStatus, onAuthRequired }: HeaderNavItemProps) {
  const isBlocked = item.requiresAuth && authStatus === 'unauthenticated';
  const isPending = item.requiresAuth && authStatus === 'loading';
  const className = [
    'ui-segmented-item',
    item.iconOnly ? 'ui-segmented-item-icon' : 'ui-segmented-item-text',
    item.active ? 'is-active' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
      {item.iconOnly ? <span className="sr-only">{item.label}</span> : item.label}
    </>
  );

  if (isBlocked || isPending) {
    return (
      <button
        type="button"
        title={item.label}
        aria-label={item.iconOnly ? item.label : undefined}
        onClick={() => {
          if (isBlocked) {
            onAuthRequired();
          }
        }}
        className={className}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      title={item.label}
      aria-label={item.iconOnly ? item.label : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}
