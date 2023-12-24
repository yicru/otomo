'use client'

import { Otomo } from '@/components/otomo'
import { Button } from '@/components/ui/button'
import { createHonoClient } from '@/lib/hono/client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { match } from 'ts-pattern'

export default function TaskDetail({ params }: { params: { taskId: string } }) {
  const [isPolling, setIsPolling] = useState(true)
  const client = createHonoClient()

  const { data } = useSWR(
    `/task-detail/${params.taskId}`,
    async () => {
      return client.api.tasks[':taskId'].status
        .$post({ param: { taskId: params.taskId } })
        .then((res) => res.json())
    },
    {
      refreshInterval: isPolling ? 1000 : 0,
    },
  )

  const status = useMemo(() => {
    return match(data?.task.status)
      .with('completed', () => 'completed' as const)
      .with('failed', () => 'failed' as const)
      .with('inProgress', () => 'inProgress' as const)
      .with('scheduled', () => 'scheduled' as const)
      .with(undefined, () => 'loading' as const)
      .otherwise(() => 'error' as const)
  }, [data])

  useEffect(() => {
    if (!isPolling) return
    if (status === 'completed' || status === 'error' || status === 'failed') {
      setIsPolling(false)
    }
  }, [isPolling, status])

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
            .with('completed', () => (
              <div>
                <p className={'font-serif text-2xl text-center'}>Completed</p>
                <Link href={'/home'}>
                  <Button size={'lg'} className={'w-full mt-4'}>
                    ホーム画面に戻る
                  </Button>
                </Link>
              </div>
            ))
            .with('error', 'failed', () => (
              <p className={'font-serif text-2xl text-center'}>Error...</p>
            ))
            .with('loading', 'inProgress', 'scheduled', () => (
              <p className={'font-serif text-2xl text-center'}>Conversion...</p>
            ))
            .exhaustive()}
        </div>
      </div>
    </div>
  )
}
