'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-base)] disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
      primary:
        'bg-[var(--brand-700)] text-[var(--on-brand)] shadow-sm hover:bg-[var(--brand-700-hover)] active:bg-[var(--brand-700-hover)] focus:ring-[var(--brand-500)]',
      secondary:
        'border border-[var(--brand-200)] bg-[var(--surface-base)] text-[var(--brand-700)] hover:bg-[var(--brand-50)] focus:ring-[var(--brand-500)]',
      ghost:
        'text-[var(--text-body)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand-700)] focus:ring-[var(--brand-500)]',
      danger:
        'bg-[var(--danger-text)] text-[var(--on-brand)] shadow-sm hover:opacity-90 focus:ring-[var(--danger-text)]'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-5 py-2.5 text-sm rounded-lg'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
