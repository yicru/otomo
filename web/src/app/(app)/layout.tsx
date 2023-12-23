import { Header } from '@/components/header'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function AppLayout(props: Props) {
  return (
    <div className={'w-full max-w-lg mx-auto'}>
      <Header />
      <div>{props.children}</div>
    </div>
  )
}
