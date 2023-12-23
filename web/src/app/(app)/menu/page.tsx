import { Otomo } from '@/components/otomo'
import { CategoryTile } from '@/features/category/components/category-tile'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { ReactElement } from 'react'

export default function Menu() {
  return (
    <div className={'grid gap-1.5 p-1.5 pb-16'}>
      <MenuTile
        href={'/home'}
        className={'bg-[#F9DC4A]'}
        label={<p className={'text-4xl font-serif'}>Home</p>}
      >
        <div
          className={
            'absolute inset-y-0 right-0 w-1/2 grid place-content-center'
          }
        >
          <img
            src={'/images/menu-home-pattern.png'}
            alt=""
            className={'absolute inset-0 mix-blend-color-burn'}
          />
          <Otomo className={'h-16 z-10'} />
        </div>
      </MenuTile>
      <MenuTile
        href={'/home'}
        className={'bg-[#EDEDED]'}
        label={
          <p className={'text-4xl font-serif'}>
            <span>Finder</span>
            <span className={'text-xs ml-2'}>(26)</span>
          </p>
        }
      >
        <div>
          <CategoryTile
            category={{ name: 'ALL', count: 120 }}
            className={
              'w-40 absolute top-0 right-0 z-20 scale-[0.6] rotate-[24deg]'
            }
          />
        </div>
        <CategoryTile
          category={{ name: 'Game List', count: 120 }}
          className={
            'w-40 absolute top-10 right-10 z-10 scale-[0.6] rotate-[-7deg]'
          }
        />
        <CategoryTile
          category={{ name: 'After Effects', count: 120 }}
          className={'w-40 absolute top-20 right-0 scale-[0.6] rotate-[11deg]'}
        />
      </MenuTile>
      <MenuTile
        href={'/home'}
        className={'bg-[#F8F8FA]'}
        label={<p className={'text-4xl font-serif'}>Setting</p>}
      />
    </div>
  )
}

const MenuTile = (props: {
  href: string
  className?: string
  label: ReactElement
  children?: React.ReactNode
}) => {
  return (
    <Link
      href={props.href}
      className={cn(
        'relative flex items-center w-full h-40 pl-8 rounded-lg overflow-hidden',
        props.className,
      )}
    >
      {props.label}
      {props.children}
    </Link>
  )
}
