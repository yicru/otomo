import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ArticleModel } from '@/db/models'
import { cn } from '@/lib/utils'

type Props = {
  article: ArticleModel
  className?: string
}

export const ArticlePreview = ({ article, className }: Props) => {
  return (
    <AspectRatio
      ratio={1 / 1.2}
      className={cn('p-2 bg-white rounded-lg overflow-hidden', className)}
    >
      <AspectRatio ratio={1.91} className={'rounded bg-neutral-100'}>
        {article.og_image && (
          <img
            src={article.og_image}
            className={'h-full w-full rounded-lg'}
            alt=""
          />
        )}
      </AspectRatio>

      <div className={'px-0.5 mt-4 space-y-2'}>
        <p className={'text-sm font-medium leading-relaxed line-clamp-2'}>
          {article.title}
        </p>

        <p className={'text-xs tracking-wider leading-snug'}>
          {article.content}
        </p>
      </div>

      <div
        className={
          'absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10'
        }
      />
    </AspectRatio>
  )
}
