import { AspectRatio } from '@/components/ui/aspect-ratio'
import { createHonoClient } from '@/lib/hono/server'
import { ArrowRightIcon, PlayIcon } from 'lucide-react'
import Link from 'next/link'

export const RecentArticlesCard = async () => {
  const client = createHonoClient()

  const result = await client.api.articles.latest
    .$get()
    .then((res) => res.json())

  if (result.articles.length === 0) {
    return null
  }

  return (
    <div className={'bg-[#F8F8FA] px-4 rounded-lg'}>
      <div className={'flex justify-between items-center py-6 border-b'}>
        <p className={'font-serif text-2xl'}>Recent</p>
        <button type={'button'} className={'inline-flex items-center'}>
          <span className={'text-xs font-medium'}>View More</span>
          <ArrowRightIcon className={'h-4 w-4 ml-1'} />
        </button>
      </div>

      {result.articles.map((article) => (
        <Link
          href={`/articles/${article.id}`}
          key={article.id}
          className={'flex items-center gap-5 py-4 border-b last:border-0'}
        >
          <div className={'flex-1'}>
            <div className={'text-gray-500/50 text-xs'}>カテゴリ</div>
            <div className={'text-sm font-medium line-clamp-2 mt-3'}>
              {article.title}
            </div>
            <div
              className={
                'inline-flex items-center px-2 py-1 border rounded-full mt-4'
              }
            >
              <PlayIcon className={'h-3 w-3 mr-2'} />
              <span className={'text-xs'}>12min・24%</span>
            </div>
          </div>

          <div className={'w-20 bg-black/10 rounded overflow-hidden'}>
            <AspectRatio ratio={3 / 4}>
              {article.og_image && (
                <img
                  src={article.og_image}
                  className={'h-full w-full object-cover object-center'}
                  alt=""
                />
              )}
            </AspectRatio>
          </div>
        </Link>
      ))}
    </div>
  )
}
