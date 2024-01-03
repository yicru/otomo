import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

import type { TaskStatus } from './enums'

export type Article = {
  id: Generated<string>
  user_id: string
  url: string
  title: string
  og_image: string | null
  content: string
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}
export type SynthesisTask = {
  id: Generated<string>
  user_id: string
  article_id: string
  polly_task_id: string
  engine: string | null
  voice_id: string | null
  status: TaskStatus | null
  status_reason: string | null
  request_characters: number | null
  output_url: string | null
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}
export type User = {
  id: Generated<string>
  uid: string
  email: string
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}
export type DB = {
  articles: Article
  synthesis_tasks: SynthesisTask
  users: User
}
