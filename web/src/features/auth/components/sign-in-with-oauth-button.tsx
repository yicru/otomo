'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { match } from 'ts-pattern'

type Props = {
  provider: 'github' | 'figma'
  className?: string
}

export const SignInWithOAuthButton = ({ provider, className }: Props) => {
  const supabase = createClient()

  const icon = match(provider)
    .with('github', () => '/github.svg')
    .with('figma', () => '/figma.svg')
    .exhaustive()

  const label = match(provider)
    .with('github', () => 'GitHubでログイン')
    .with('figma', () => 'Figmaでログイン')
    .exhaustive()

  const handleClick = async () => {
    await supabase.auth.signInWithOAuth({
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
      provider: provider,
    })
  }

  return (
    <Button
      className={cn('tracking-wide', className)}
      size={'lg'}
      variant={'secondary'}
      onClick={handleClick}
    >
      <img src={icon} className={'h-4 w-4 mr-4'} alt={`${provider} logo`} />
      <span>{label}</span>
    </Button>
  )
}
