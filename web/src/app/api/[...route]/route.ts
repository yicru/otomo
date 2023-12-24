import { createSupabaseClient } from '@/lib/supabase/server'
import { Hono } from 'hono'
import { cookies } from 'next/headers'

const app = new Hono().basePath('/api')

const auth = async () => {
  const cookieStore = cookies()
  const supabase = createSupabaseClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

const route = app.get('/auth/me', async (c) => {
  const authUser = await auth()

  return c.json({
    me: authUser,
  })
})

const fetch = app.fetch

export { fetch as GET, fetch as PUT, fetch as POST, fetch as DELETE }

export type AppType = typeof route
