import { Logo } from '@/components/logo'
import { Otomo } from '@/components/otomo'
import { GripIcon } from 'lucide-react'
import Link from 'next/link'

export const Header = () => {
  return (
    <header className={'flex justify-between items-center px-4 py-5'}>
      <Otomo className={'h-7'} />
      <Link href={'/home'}>
        <Logo />
      </Link>
      <Link href={'/menu'}>
        <GripIcon className={'text-white'} />
      </Link>
    </header>
  )
}
