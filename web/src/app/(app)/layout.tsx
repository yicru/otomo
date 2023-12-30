import { Header } from '@/components/header'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default async function AppLayout(props: Props) {
  return (
    <div
      className={
        'grid grid-rows-[auto,1fr] min-h-[100dvh] w-full max-w-lg mx-auto'
      }
    >
      <Header />
      <div>{props.children}</div>
    </div>
  )
}
