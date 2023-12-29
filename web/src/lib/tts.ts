import { env } from '@/lib/env'
import textToSpeech from '@google-cloud/text-to-speech'

const credential = JSON.parse(
  Buffer.from(env.GOOGLE_SERVICE_KEY, 'base64').toString(),
)

export const textToSpeechClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  },
})
