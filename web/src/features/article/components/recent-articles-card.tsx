import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ArrowRightIcon, PlayIcon } from 'lucide-react'

const articles = [
  {
    id: '1',
    category: 'Unreal Engine 5',
    title: '大デザナレ展2023 出展レポートDeNAのデザインナレッジを大公開',
    image: 'https://source.unsplash.com/random/1',
  },
  {
    id: '2',
    category: 'Unreal Engine 5',
    title:
      '広すぎか！UI/UXのデザイナーの職務領域 〜逆立ちしながらラーメンを食べる〜 　#UIUXデザイナー',
    image: 'https://source.unsplash.com/random/2',
  },
  {
    id: '2',
    category: 'Unreal Engine 5',
    title:
      '広すぎか！UI/UXのデザイナーの職務領域 〜逆立ちしながらラーメンを食べる〜 　#UIUXデザイナー',
    image: 'https://source.unsplash.com/random/3',
  },
]

export const RecentArticlesCard = () => {
  return (
    <div className={'bg-[#F8F8FA] px-4 rounded-lg'}>
      <div className={'flex justify-between items-center py-6 border-b'}>
        <p className={'font-serif text-2xl'}>Recent</p>
        <button className={'inline-flex items-center'}>
          <span className={'text-xs font-medium'}>View More</span>
          <ArrowRightIcon className={'h-4 w-4 ml-1'} />
        </button>
      </div>

      {articles.map((article) => (
        <div
          key={article.id}
          className={'flex items-center gap-5 py-4 border-b last:border-0'}
        >
          <div className={'flex-1'}>
            <div className={'text-gray-500/50 text-xs'}>{article.category}</div>
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

          <div className={'w-20'}>
            <AspectRatio ratio={3 / 4}>
              <img
                src={article.image}
                className={'h-full w-full object-cover object-center rounded'}
                alt=""
              />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  )
}
