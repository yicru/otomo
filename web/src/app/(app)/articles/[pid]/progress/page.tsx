'use client'

import { Otomo } from '@/components/otomo'
import { TaskStatus } from '@/db/enums'
import { createHonoClient } from '@/lib/hono/client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { match } from 'ts-pattern'

export default function ArticleDetailProgress({
  params,
}: { params: { pid: string } }) {
  const [isPolling, setIsPolling] = useState(true)
  const client = createHonoClient()

  const { data: status } = useSWR(
    `/articles/${params.pid}/progress`,
    async () => {
      const response = await client.api.articles[':articleId'].progress
        .$post({ param: { articleId: params.pid } })
        .then((res) => res.json())

      return response.synthesisTask.status
    },
    {
      refreshInterval: isPolling ? 1000 : 0,
    },
  )

  useEffect(() => {
    if (!isPolling) return
    if (status === TaskStatus.COMPLETED || status === TaskStatus.FAILED) {
      setIsPolling(false)
    }
  }, [isPolling, status])

  if (status === TaskStatus.COMPLETED) {
    return redirect(`/articles/${params.pid}/done`)
  }

  return (
    <div className={'h-[90vh] p-1.5'}>
      <div
        className={'h-full rounded-lg bg-blend-overlay'}
        style={{
          background:
            'radial-gradient(76.89% 40.18% at 50.13% 37.99%, rgba(0, 0, 0, 0.00) 36.15%, #000 100%), #F9DC4A',
        }}
      >
        <div className={'relative h-[70%] w-full grid place-content-center'}>
          <Otomo className={'h-24'} />
          <img
            src={'/images/task-result-pattern.png'}
            className={
              'absolute inset-0 h-full w-full object-contain object-center mix-blend-color-burn'
            }
            alt=""
          />
        </div>

        <div className={'mt-10 px-6'}>
          {match(status)
            .with(TaskStatus.FAILED, () => (
              <p className={'font-serif text-2xl text-center'}>
                エラーが発生しました
              </p>
            ))
            .otherwise(() => (
              <p className={'font-serif text-2xl text-center'}>Conversion...</p>
            ))}
        </div>
      </div>
    </div>
  )
}
