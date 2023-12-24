import { type AppType } from '@/app/api/[...route]/route'
import { env } from '@/lib/env'
import { hc } from 'hono/client'
import { cookies } from 'next/headers'

export const createHonoClient = () => {
  return hc<AppType>(env.NEXT_PUBLIC_APP_ORIGIN, {
    headers: {
      cookie: cookies().toString(),
    },
  })
}
