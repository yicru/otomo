import { type AppType } from '@/app/api/[...route]/route'
import { hc } from 'hono/client'
import { cookies } from 'next/headers'

export const createHonoClient = () => {
  return hc<AppType>(process.env.NEXT_PUBLIC_APP_ORIGIN!, {
    headers: {
      cookie: cookies().toString(),
    },
  })
}
