import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Progress } from '@/components/ui/progress'
import { createHonoClient } from '@/lib/hono/server'
import { ArrowLeftIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { PlayIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react'
import Link from 'next/link'

export default async function ArticleDetail({
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
    <div className={'h-full p-1.5'}>
      <div className={'h-full bg-[#F8F8FA] px-4 rounded-lg'}>
        <div className={'sticky top-0 z-10'}>
          <div
            className={
              'flex justify-between items-center py-4 px-0.5 bg-[#F8F8FA] border-b'
            }
          >
            <Link href={'/home'} className={'inline-flex items-center gap-2'}>
              <ArrowLeftIcon className={'w-4 h-4'} />
              <span className={'text-sm font-medium'}>Back</span>
            </Link>
            <DotsHorizontalIcon className={'w-4 h-4'} />
          </div>
        </div>

        <div className={'py-5'}>
          {article.og_image && (
            <AspectRatio ratio={1.91} className={'rounded bg-neutral-100'}>
              <img
                src={article.og_image}
                className={'h-full w-full rounded-lg'}
                alt=""
              />
            </AspectRatio>
          )}

          <div className={'py-5 border-b'}>
            <p className={'tracking-wide leading-relaxed font-medium'}>
              {article.title}
            </p>
          </div>

          <div className={'py-5'}>
            <p className={'text-sm leading-snug whitespace-pre-line break-all'}>
              {article.content}
            </p>
          </div>

          <div
            className={
              'sticky bottom-0 bg-gradient-to-t from-[#F8F8FA] from-70% to-transparent px-6 pt-20 pb-6'
            }
          >
            <Progress value={33} className={'h-1'} />
            <div className={'flex justify-between mt-1 text-xs'}>
              <p>0:42</p>
              <p>-2:42</p>
            </div>
            <div className={'flex justify-around items-center px-4 mt-2'}>
              <button type={'button'}>
                <SkipBackIcon className={'h-6 w-6'} />
              </button>
              <button
                type={'button'}
                className={
                  'h-14 w-14 grid place-content-center bg-black text-white rounded-full'
                }
              >
                <PlayIcon className={'h-6 w-6'} />
              </button>
              <button type={'button'}>
                <SkipForwardIcon className={'h-6 w-6'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
