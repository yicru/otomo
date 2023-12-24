import { db } from '@/db'
import { articles, tasks, users } from '@/db/schema'
import { env } from '@/lib/env'
import { pollyClient } from '@/lib/polly'
import { createSupabaseClient } from '@/lib/supabase/server'
import {
  GetSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommand,
} from '@aws-sdk/client-polly'
import { zValidator } from '@hono/zod-validator'
import * as cheerio from 'cheerio'
import { eq } from 'drizzle-orm'
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

  if (!supabaseUser || !supabaseUser.email) {
    return null
  }

  const [user] = await db
    .insert(users)
    .values({ uid: supabaseUser.id, email: supabaseUser.email })
    .onConflictDoUpdate({
      target: users.uid,
      set: { email: supabaseUser.email },
    })
    .returning()

  return user
}

const route = app
  .get('/auth/me', async (c) => {
    const authUser = await auth()

    return c.json({
      me: authUser,
    })
  })
  .post(
    'tasks',
    zValidator(
      'json',
      z.object({
        url: z.string().url(),
      }),
    ),
    async (c) => {
      const authUser = await auth()
      const json = c.req.valid('json')

      if (!authUser) {
        return c.json({ error: 'Unauthorized' }, 401)
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

      const result = await db.transaction(async (tx) => {
        if (!SynthesisTask?.TaskId) {
          throw new Error('Failed to start synthesis task')
        }

        try {
          const [task] = await tx
            .insert(tasks)
            .values({
              userId: authUser.id,
              pollyTaskId: SynthesisTask.TaskId,
              engine: SynthesisTask.Engine,
              speaker: SynthesisTask.VoiceId,
              status: SynthesisTask.TaskStatus,
              statusReason: SynthesisTask.TaskStatusReason,
              requestCharacters: SynthesisTask.RequestCharacters,
              outputUrl: SynthesisTask.OutputUri,
            })
            .returning()

          await tx
            .insert(articles)
            .values({
              userId: authUser.id,
              taskId: task.id,
              url: json.url,
              title: title,
              image: ogImage,
              content: content,
            })
            .returning()

          return { task }
        } catch (e) {
          console.log(e)
          throw e
        }
      })

      return c.json({
        task: result.task,
      })
    },
  )
  .post(
    '/tasks/:taskId/status',
    zValidator(
      'param',
      z.object({
        taskId: z.string().min(1),
      }),
    ),
    async (c) => {
      const authUser = await auth()
      const param = c.req.valid('param')

      if (!authUser) {
        throw new HTTPException(401, { message: 'Unauthorized' })
      }

      const task = await db.query.tasks.findFirst({
        where: (tasks, { eq, and }) =>
          and(eq(tasks.id, param.taskId), eq(tasks.userId, authUser.id)),
      })

      if (!task) {
        throw new HTTPException(404, { message: 'Task is not found' })
      }

      const command = new GetSpeechSynthesisTaskCommand({
        TaskId: task.pollyTaskId,
      })

      const { SynthesisTask } = await pollyClient.send(command)

      if (!SynthesisTask) {
        throw new HTTPException(404, { message: 'SynthesisTask is not found' })
      }

      const [updated] = await db
        .update(tasks)
        .set({
          status: SynthesisTask.TaskStatus,
          statusReason: SynthesisTask.TaskStatusReason,
        })
        .where(eq(tasks.id, task.id))
        .returning()

      return c.json({
        task: updated,
      })
    },
  )

const fetch = app.fetch

export { fetch as GET, fetch as PUT, fetch as POST, fetch as DELETE }

export type AppType = typeof route
