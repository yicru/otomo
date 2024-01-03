import { db } from '@/db'
import { createArticleSchema } from '@/features/article/validations/create-article-schema'
import { getTaskStatus } from '@/features/synthesis-task/utils/get-task-status'
import { env } from '@/lib/env'
import { pollyClient } from '@/lib/polly'
import { createSupabaseClient } from '@/lib/supabase/server'
import {
  GetSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommand,
} from '@aws-sdk/client-polly'
import { zValidator } from '@hono/zod-validator'
import * as cheerio from 'cheerio'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { convert } from 'html-to-text'
import { cookies } from 'next/headers'
import { ofetch } from 'ofetch'
import { z } from 'zod'

const app = new Hono().basePath('/api')

const auth = async () => {
  const cookieStore = cookies()
  const supabase = createSupabaseClient(cookieStore)

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser?.email) {
    return null
  }

  return db
    .insertInto('users')
    .values({ uid: supabaseUser.id, email: supabaseUser.email })
    .onConflict((oc) =>
      oc.column('uid').doUpdateSet({
        email: supabaseUser.email,
      }),
    )
    .returningAll()
    .executeTakeFirst()
}

const route = app
  .get('/auth/me', async (c) => {
    const authUser = await auth()

    return c.json({
      me: authUser,
    })
  })
  .get('/articles/latest', async (c) => {
    const authUser = await auth()

    if (!authUser) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const latestArticles = await db
      .selectFrom('articles')
      .where('user_id', '=', authUser.id)
      .orderBy('created_at', 'desc')
      .limit(3)
      .selectAll()
      .execute()

    return c.json({
      articles: latestArticles,
    })
  })
  .get(
    '/articles/:articleId',
    zValidator(
      'param',
      z.object({
        articleId: z.string(),
      }),
    ),
    async (c) => {
      const authUser = await auth()
      const param = c.req.valid('param')

      if (!authUser) {
        throw new HTTPException(401, { message: 'Unauthorized' })
      }

      const article = await db
        .selectFrom('articles')
        .where('id', '=', param.articleId)
        .selectAll()
        .executeTakeFirstOrThrow()

      return c.json({
        article: article,
      })
    },
  )
  .post('articles', zValidator('json', createArticleSchema), async (c) => {
    const authUser = await auth()
    const json = c.req.valid('json')

    if (!authUser) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const html = await ofetch(json.url)
    const $ = cheerio.load(html)

    const title = $('title').text()
    const ogImage = $('meta[property="og:image"]').attr('content')

    const content = convert(html, {
      selectors: [
        { selector: 'a', options: { ignoreHref: true } },
        { selector: 'img', format: 'skip' },
      ],
    })

    const command = new StartSpeechSynthesisTaskCommand({
      Engine: 'standard',
      OutputFormat: 'mp3',
      OutputS3BucketName: env.AWS_POLLY_OUTPUT_BUCKET,
      Text: content,
      VoiceId: 'Mizuki',
    })

    const { SynthesisTask } = await pollyClient.send(command)

    if (!SynthesisTask?.TaskId) {
      throw new HTTPException(500, { message: 'Failed to create task' })
    }

    const result = await db.transaction().execute(async (trx) => {
      const article = await trx
        .insertInto('articles')
        .values({
          user_id: authUser.id,
          url: json.url,
          title: title,
          og_image: ogImage,
          content: content,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      const synthesisTask = await trx
        .insertInto('synthesis_tasks')
        .values({
          user_id: authUser.id,
          article_id: article.id,
          polly_task_id: SynthesisTask.TaskId as string,
          engine: SynthesisTask.Engine,
          voice_id: SynthesisTask.VoiceId,
          status: getTaskStatus(SynthesisTask),
          status_reason: SynthesisTask.TaskStatusReason,
          request_characters: SynthesisTask.RequestCharacters,
          output_url: SynthesisTask.OutputUri,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      return { article, synthesisTask }
    })

    return c.json({
      article: result.article,
      synthesisTask: result.synthesisTask,
    })
  })
  .post(
    '/articles/:articleId/progress',
    zValidator(
      'param',
      z.object({
        articleId: z.string(),
      }),
    ),
    async (c) => {
      const authUser = await auth()
      const param = c.req.valid('param')

      if (!authUser) {
        throw new HTTPException(401, { message: 'Unauthorized' })
      }

      const article = await db
        .selectFrom('articles')
        .where('articles.id', '=', param.articleId)
        .where('articles.user_id', '=', authUser.id)
        .innerJoin(
          'synthesis_tasks',
          'articles.id',
          'synthesis_tasks.article_id',
        )
        .selectAll()
        .executeTakeFirstOrThrow()

      const command = new GetSpeechSynthesisTaskCommand({
        TaskId: article.polly_task_id,
      })

      const { SynthesisTask } = await pollyClient.send(command)

      if (!SynthesisTask) {
        throw new HTTPException(404, { message: 'SynthesisTask is not found' })
      }

      const updated = await db
        .updateTable('synthesis_tasks')
        .where('article_id', '=', param.articleId)
        .set({
          status: getTaskStatus(SynthesisTask),
          status_reason: SynthesisTask.TaskStatusReason,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      return c.json({
        article: article,
        synthesisTask: updated,
      })
    },
  )

const fetch = app.fetch

export { fetch as GET, fetch as PUT, fetch as POST, fetch as DELETE }

export type AppType = typeof route
