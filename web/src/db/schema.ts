import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  uid: varchar('uid', { length: 256 }).unique().notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
