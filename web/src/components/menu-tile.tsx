import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  href: string
  className?: string
  label: string
  children?: React.ReactNode
}

export const MenuTile = ({ href, className, label, children }: Props) => {
  return (
    <Link
      href={href}
      className={cn('relative flex items-center w-full h-40 pl-8 rounded-lg', className)}
    >
      <p className={'text-4xl font-serif'}>{label}</p>
      {children}
    </Link>
  )
}
