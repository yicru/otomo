import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createSupabaseClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export function SignInWithOtpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createSupabaseClient()

  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    const result = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (result.error) {
      toast.error('マジックリンクの送信に失敗しました', {
        description: result.error.message,
      })
    } else {
      toast.error('マジックリンクをメールで送信しました', {
        description: 'メールを確認してログインしてください',
      })
      form.reset()
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading}>
          <FormField
            control={form.control}
            name={'email'}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={'text-xs'}>メールアドレス</FormLabel>
                <FormControl>
                  <Input required type={'email'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <Button disabled={isLoading} className={'mt-6 w-full'} type={'submit'}>
          マジックリンクを送信
        </Button>
      </form>
    </Form>
  )
}
