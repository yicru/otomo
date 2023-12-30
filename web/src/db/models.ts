import { Article, User } from '@/db/types'
import { Generated } from 'kysely'

type Model<T> = {
  [P in keyof T]: T[P] extends Generated<infer R> ? R : T[P]
}

export type ArticleModel = Model<Article>
export type UserModel = Model<User>
