import { env } from '@/lib/env'
import { defineConfig } from 'drizzle-kit'

import 'dotenv/config'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
})
