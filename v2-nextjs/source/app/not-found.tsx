import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-page)] text-[var(--text-body)]">
      <div className="text-center p-8">
        <h2 className="mb-4 text-4xl font-bold text-[var(--text-strong)]">404</h2>
        <p className="mb-6 text-[var(--text-body)]">Page not found</p>
        <Link
          href="/"
          className="rounded-lg bg-[var(--brand-700)] px-4 py-2 text-[var(--on-brand)] hover:bg-[var(--brand-700-hover)]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

