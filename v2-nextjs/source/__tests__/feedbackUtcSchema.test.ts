import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('AI feedback UTC timestamp schema', () => {
  it('stores feedback and rate-limit timestamps as timezone-aware values', () => {
    const schema = readFileSync('prisma/feedback/schema.prisma', 'utf8');

    expect(schema.match(/@db\.Timestamptz\(3\)/g)).toHaveLength(6);
  });

  const migrationPath =
    'prisma/feedback/migrations/20260730010000_use_utc_timestamptz/migration.sql';

  it.skipIf(!existsSync(migrationPath))(
    'migrates existing feedback timestamps with an explicit UTC interpretation',
    () => {
      const migration = readFileSync(migrationPath, 'utf8');

      expect(migration).toContain('TYPE TIMESTAMPTZ(3)');
      expect(migration).toContain("AT TIME ZONE 'UTC'");
    },
  );
});
