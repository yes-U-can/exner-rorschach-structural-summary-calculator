'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-[var(--brand-page)] text-[var(--text-body)]">
        <div className="text-center p-8">
          <h2 className="mb-4 text-xl font-semibold text-[var(--text-strong)]">
            Something went wrong
          </h2>
          <p className="mb-2 text-[var(--text-body)]">
            We could not load the application. Please try again.
          </p>
          {error.digest ? (
            <p className="mb-6 text-sm text-[var(--text-soft)]">Reference ID: {error.digest}</p>
          ) : (
            <div className="mb-6" />
          )}
          <button
            onClick={reset}
            className="rounded-lg bg-[var(--brand-700)] px-4 py-2 text-[var(--on-brand)] hover:bg-[var(--brand-700-hover)]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

