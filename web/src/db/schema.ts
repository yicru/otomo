import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  uid: varchar('uid', { length: 256 }).unique().notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),

  pollyTaskId: varchar('polly_task_id', { length: 256 }).unique().notNull(),
  engine: varchar('engine', { length: 256 }),
  speaker: varchar('speaker', { length: 256 }),
  status: varchar('status', { length: 256 }),
  statusReason: text('status_reason'),
  requestCharacters: integer('request_characters'),
  outputUrl: varchar('output_url', { length: 256 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),

  taskId: uuid('task_id')
    .references(() => tasks.id)
    .notNull(),

  url: text('url').notNull(),
  title: text('title').notNull(),
  image: text('image'),
  content: text('content').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
