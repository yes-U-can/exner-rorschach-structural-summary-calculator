'use client';

import { Fragment } from 'react';
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Language } from '@/types';
import { getKeyboardShortcutsUi } from '@/lib/keyboardShortcutsUi';

type ShortcutRow = {
  label: string;
  keyGroups: string[][];
};

function ShortcutKeys({ keyGroups }: { keyGroups: string[][] }) {
  return (
    <span
      className="ui-shortcut-keys"
      aria-label={keyGroups.map((group) => group.join(' + ')).join(' or ')}
    >
      {keyGroups.map((group, groupIndex) => (
        <Fragment key={group.join('-')}>
          {groupIndex > 0 ? <span className="ui-shortcut-alternative" aria-hidden="true">/</span> : null}
          <span className="ui-shortcut-key-group">
            {group.map((key, keyIndex) => (
              <Fragment key={`${key}-${keyIndex}`}>
                {keyIndex > 0 ? <span className="ui-shortcut-plus" aria-hidden="true">+</span> : null}
                <kbd>{key}</kbd>
              </Fragment>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}

function ShortcutList({ rows }: { rows: ShortcutRow[] }) {
  return (
    <dl className="ui-shortcuts-list">
      {rows.map((row) => (
        <div key={row.label} className="ui-shortcuts-row">
          <dt>{row.label}</dt>
          <dd><ShortcutKeys keyGroups={row.keyGroups} /></dd>
        </div>
      ))}
    </dl>
  );
}

export default function KeyboardShortcutsDialog({
  open,
  language,
  onClose,
}: {
  open: boolean;
  language: Language;
  onClose: () => void;
}) {
  const ui = getKeyboardShortcutsUi(language);

  const rows: ShortcutRow[] = [
    { label: ui.undo, keyGroups: [['Ctrl/⌘', 'Z']] },
    { label: ui.redo, keyGroups: [['Ctrl/⌘', 'Y'], ['Ctrl/⌘', 'Shift', 'Z']] },
    { label: ui.selectAllRows, keyGroups: [['Ctrl/⌘', 'A']] },
    { label: ui.selectRowRange, keyGroups: [['Shift', ui.clickKey]] },
    { label: ui.toggleRowSelection, keyGroups: [['Ctrl/⌘', ui.clickKey]] },
    { label: ui.zoomScoringCanvas, keyGroups: [['Alt', ui.mouseScrollKey]] },
    { label: ui.panScoringCanvas, keyGroups: [['Ctrl', ui.dragKey]] },
    { label: ui.toggleCodingAssistant, keyGroups: [['Ctrl/⌘', 'J']] },
    { label: ui.toggleSidebar, keyGroups: [['Ctrl/⌘', 'B']] },
  ];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[16000] print:hidden" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="ui-shortcuts-backdrop fixed inset-0" />
        </TransitionChild>

        <div className="fixed inset-y-0 left-0 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="transform ease-out duration-150"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="transform ease-in duration-100"
              leaveFrom="translate-y-0 opacity-100 sm:scale-100"
              leaveTo="translate-y-2 opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="ui-shortcuts-dialog">
                <div className="ui-shortcuts-header">
                  <DialogTitle className="ui-shortcuts-title">{ui.title}</DialogTitle>
                  <button
                    type="button"
                    className="ui-app-icon-button"
                    onClick={onClose}
                    aria-label={ui.close}
                    title={ui.close}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <DialogDescription className="sr-only">{ui.description}</DialogDescription>

                <div className="ui-shortcuts-body">
                  <ShortcutList rows={rows} />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
