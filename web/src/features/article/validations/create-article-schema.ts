import { z } from 'zod'

export const createArticleSchema = z.object({
  url: z.string().url(),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>
