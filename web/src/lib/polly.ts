import { env } from '@/lib/env'
import { PollyClient } from '@aws-sdk/client-polly'

export const pollyClient = new PollyClient({
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-northeast-1',
})
