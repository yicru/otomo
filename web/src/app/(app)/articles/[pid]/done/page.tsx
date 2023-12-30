import { Button } from '@/components/ui/button'
import { ArticlePreview } from '@/features/article/components/article-preview'
import { createHonoClient } from '@/lib/hono/server'
import { MicIcon } from 'lucide-react'

export default async function ArticleDone({
  params,
}: { params: { pid: string } }) {
  const client = createHonoClient()

  const result = await client.api.articles[':articleId'].$get({
    param: {
      articleId: params.pid,
    },
  })

  const { article } = await result.json()

  return (
    <div className={'h-[90vh] p-1.5'}>
      <div
        className={
          'h-full rounded-lg bg-blend-overlay grid grid-rows-[70%,1fr] gap-10'
        }
        style={{
          background:
            'radial-gradient(76.89% 40.18% at 50.13% 37.99%, rgba(0, 0, 0, 0.00) 36.15%, #000 100%), #F9DC4A',
        }}
      >
        <div className={'relative flex justify-center items-center'}>
          <div className={'w-2/3 rotate-4 z-10'}>
            <ArticlePreview
              article={article}
              className={
                'shadow-lg animate-in fade-in slide-in-from-top-10 duration-700'
              }
            />
          </div>
          <img
            src={'/images/task-result-pattern.png'}
            className={
              'absolute inset-0 h-full w-full object-contain object-center mix-blend-color-burn'
            }
            alt=""
          />
        </div>

        <div className={'mt-10 px-6'}>
          <Button size={'lg'} className={'w-full h-14 mt-4'}>
            <MicIcon className={'h-4 w-4 mr-2'} />
            Listen
          </Button>
        </div>
      </div>
    </div>
  )
}
