import { env } from '@/lib/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(env.DATABASE_URL, { prepare: false })

export const db = drizzle(client, { schema })
