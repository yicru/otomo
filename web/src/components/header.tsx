import { Logo } from '@/components/logo'
import { Otomo } from '@/components/otomo'
import { GripIcon } from 'lucide-react'

export const Header = () => {
  return (
    <header className={'flex justify-between items-center px-4 py-5'}>
      <Otomo className={'h-7'} />
      <Logo />
      <GripIcon className={'text-white'} />
    </header>
  )
}
