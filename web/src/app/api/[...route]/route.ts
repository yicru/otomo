import { db } from '@/db'
import { createArticleSchema } from '@/features/article/validations/create-article-schema'
import { createSupabaseClient } from '@/lib/supabase/server'
import { zValidator } from '@hono/zod-validator'
import * as cheerio from 'cheerio'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { convert } from 'html-to-text'
import { cookies } from 'next/headers'
import { ofetch } from 'ofetch'

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

    const article = await db
      .insertInto('articles')
      .values({
        user_id: authUser.id,
        url: json.url,
        title: title,
        og_image: ogImage,
        content: content,
      })
      .returningAll()
      .executeTakeFirst()

    return c.json({
      article: article,
    })
  })

const fetch = app.fetch

export { fetch as GET, fetch as PUT, fetch as POST, fetch as DELETE }

export type AppType = typeof route
