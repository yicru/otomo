import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

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
export type User = {
  id: Generated<string>
  uid: string
  email: string
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
}
export type DB = {
  articles: Article
  users: User
}
