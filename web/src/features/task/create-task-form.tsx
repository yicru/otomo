'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createHonoClient } from '@/lib/hono/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, MicIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  url: z.string().url(),
})

type FormValues = z.infer<typeof formSchema>

export function CreateTaskForm() {
  const [isLoading, setIsLoading] = useState(false)
  const client = createHonoClient()
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      url: '',
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      const result = await client.api.tasks
        .$post({ json: { url: values.url } })
        .then((res) => res.json())

      router.push(`/tasks/${result.task.id}`)
    } catch (e) {
      toast.error('エラーが発生しました', {
        description: e instanceof Error ? e.message : '不明なエラーです',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form className={'relative'} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          disabled={isLoading}
          control={form.control}
          name={'url'}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={'relative'}>
                  <Input
                    required
                    placeholder={'Add Link...'}
                    className={'py-5 pl-4 pr-16 bg-white border-black'}
                    {...field}
                  />

                  <Button className={'absolute h-auto top-1 bottom-1 right-1'}>
                    {isLoading ? (
                      <Loader2Icon className={'h-4 w-4 animate-spin'} />
                    ) : (
                      <MicIcon className={'h-4 w-4'} />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
