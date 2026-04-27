'use client';

import type { CSSProperties, ReactNode } from 'react';

type ChatRole = 'ai' | 'user';

export function ChatSystemNotice({ children }: { children: ReactNode }) {
  const systemNoticeStyle = {
    backgroundColor: 'var(--chat-system-bg)',
    borderColor: 'var(--chat-system-border)',
    color: 'var(--chat-system-text)',
  } satisfies CSSProperties;

  return (
    <div className="ui-chat-system-row">
      <p className="ui-chat-system-pill" style={systemNoticeStyle}>{children}</p>
    </div>
  );
}

export function ChatMessageRow({
  role,
  children,
}: {
  role: ChatRole;
  children: ReactNode;
}) {
  return (
    <div className={`flex ${role === 'ai' ? 'justify-start' : 'justify-end'}`}>
      {children}
    </div>
  );
}

export function ChatBubble({
  role,
  children,
  className = '',
}: {
  role: ChatRole;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        'ui-chat-message',
        role === 'ai' ? 'ui-chat-message-ai' : 'ui-chat-message-user',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export function ChatMessageText({ children }: { children: ReactNode }) {
  return (
    <p className="ui-chat-message-text">
      {children}
    </p>
  );
}
