import type { ReactNode } from 'react';

export type HeaderNavItemConfig = {
  href: string;
  label: string;
  active: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  requiresAuth?: boolean;
};
