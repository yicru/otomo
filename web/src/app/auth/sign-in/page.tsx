'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SignInWithOAuthButton } from '@/features/auth/components/sign-in-with-oauth-button'
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
            <SignInWithOAuthButton provider={'github'} className={'w-full'} />
            <SignInWithOAuthButton provider={'figma'} className={'w-full'} />
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
