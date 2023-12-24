import { env } from '@/lib/env'
import { createBrowserClient } from '@supabase/ssr'

export const createSupabaseClient = () =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
