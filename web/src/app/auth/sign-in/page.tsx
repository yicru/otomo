'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SignInWithOtpForm } from '@/features/auth/components/sign-in-with-otp-form'

export default function SignIn() {
  return (
    <div className={'pt-8'}>
      <Card>
        <CardHeader className={'gap-1'}>
          <CardTitle>ログイン</CardTitle>
          <CardDescription className={'text-xs'}>
            つづけるにはログインが必要です
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={'space-y-4'}>
            <Button
              className={'w-full tracking-wide'}
              size={'lg'}
              variant={'secondary'}
            >
              <img
                src={'/github.svg'}
                className={'h-4 w-4 mr-4'}
                alt={'GitHub Logo'}
              />
              <span>GitHubでログイン</span>
            </Button>

            <Button
              className={'w-full tracking-wide'}
              size={'lg'}
              variant={'secondary'}
            >
              <img
                src={'/figma.svg'}
                className={'h-4 w-4 mr-6'}
                alt={'Figma Logo'}
              />
              <span>Figmaでログイン</span>
            </Button>
          </div>

          <div className={'grid grid-cols-[1fr,60px,1fr] items-center mt-6'}>
            <Separator />
            <p className={'text-center text-xs font-medium text-gray-500'}>
              または
            </p>
            <Separator />
          </div>

          <div className={'mt-4'}>
            <SignInWithOtpForm />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
