import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VersionArchiveList from '@/components/versions/VersionArchiveList';
import { v1GasVersions, v2NextVersions } from '@/lib/versionArchive';

export const metadata: Metadata = {
  title: 'Version Archive',
  description: 'Version archive for the Rorschach Structural Summary web app and the v1 GAS releases.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function VersionsPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-page)] text-[var(--text-body)]">
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <section className="ui-ref-card rounded-3xl p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
            {'\uBC84\uC804 \uC544\uCE74\uC774\uBE0C'}
          </h1>
          <VersionArchiveList v2NextVersions={v2NextVersions} v1GasVersions={v1GasVersions} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
