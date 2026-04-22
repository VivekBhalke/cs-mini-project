import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { env } from './config/env.js';
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env.DATABASE_URL,
  },
});