'use client';

import { Fragment, ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeLabel?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeLabel = 'Close'
}: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[15000]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[var(--surface-overlay)]" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`w-full ${sizes[size]} transform overflow-visible rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6 text-left align-middle text-[var(--text-body)] shadow-xl transition-colors`}
              >
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between mb-4">
                    {title && (
                      <DialogTitle
                        as="h3"
                        className="text-xl font-semibold leading-6 text-[var(--text-strong)]"
                      >
                        {title}
                      </DialogTitle>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="ml-auto rounded-lg p-1.5 text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-body)]"
                        onClick={onClose}
                      >
                        <span className="sr-only">{closeLabel}</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
