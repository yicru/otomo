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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export function SignInWithOtpForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: FormValues) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <Button className={'mt-6 w-full'} type={'submit'}>
          マジックリンクを送信
        </Button>
      </form>
    </Form>
  )
}
