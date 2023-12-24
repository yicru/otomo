import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default async function AppLayout(props: Props) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/sign-in')
  }

  return (
    <div className={'w-full max-w-lg mx-auto'}>
      <Header />
      <div>{props.children}</div>
    </div>
  )
}
