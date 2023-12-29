import { db } from '@/db'
import { env } from '@/lib/env'
import { pollyClient } from '@/lib/polly'
import { createSupabaseClient } from '@/lib/supabase/server'
import { textToSpeechClient } from '@/lib/tts'
import { StartSpeechSynthesisTaskCommand } from '@aws-sdk/client-polly'
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

  if (!supabaseUser || !supabaseUser.email) {
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

    // const latestArticles = await db.query.articles.findMany({
    //   where: (articles, { eq }) => eq(articles.userId, authUser.id),
    //   orderBy: (articles, { desc }) => desc(articles.createdAt),
    //   limit: 3,
    // })

    return c.json({
      articles: [],
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

      return c.json({
        task: null,
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

      return c.json({
        task: null,
      })
    },
  )
  .post('/internal/tts', async (c) => {
    const result = await textToSpeechClient.synthesizeSpeech({
      input: {
        text: 'こんにちは',
      },
      voice: {
        languageCode: 'ja-JP',
        name: 'ja-JP-Wavenet-A',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    })

    return c.json({ result })
  })

const fetch = app.fetch

export { fetch as GET, fetch as PUT, fetch as POST, fetch as DELETE }

export type AppType = typeof route
