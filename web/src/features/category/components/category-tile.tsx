import { cn } from '@/lib/utils'
import { LayoutGridIcon } from 'lucide-react'

type Props = {
  className?: string
  category: {
    name: string
    count: number
  }
}

export const CategoryTile = ({ className, category }: Props) => {
  return (
    <div className={cn('relative', className)}>
      <div className={'relative bg-white z-10 rounded-lg shadow-lg p-4'}>
        <div className={'flex justify-between items-start'}>
          <LayoutGridIcon className={'h-5 w-5'} />
          <p className={'text-2xs opacity-50'}>{category.count}記事</p>
        </div>
        <p className={'text-sm mt-6'}>{category.name}</p>
      </div>

      {category.count > 10 && (
        <div
          className={'absolute inset-0 rotate-4 bg-white rounded-lg shadow-lg'}
        />
      )}

      {category.count > 50 && (
        <div
          className={'absolute inset-0 -rotate-4 bg-white rounded-lg shadow-lg'}
        />
      )}
    </div>
  )
}
