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
import {
  CreateArticleInput,
  createArticleSchema,
} from '@/features/article/validations/create-article-schema'
import { createHonoClient } from '@/lib/hono/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, MicIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function CreateArticleForm() {
  const [isLoading, setIsLoading] = useState(false)
  const client = createHonoClient()
  const router = useRouter()

  const form = useForm<CreateArticleInput>({
    defaultValues: {
      url: '',
    },
    resolver: zodResolver(createArticleSchema),
  })

  const onSubmit = async (values: CreateArticleInput) => {
    setIsLoading(true)

    try {
      const result = await client.api.articles
        .$post({ json: { url: values.url } })
        .then((res) => res.json())

      router.push(`/articles/${result.article.id}/done`)
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
