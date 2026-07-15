import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/feedback/schema.prisma',
  migrations: {
    path: 'prisma/feedback/migrations',
  },
  datasource: {
    url: process.env.AI_FEEDBACK_DATABASE_URL,
  },
});
