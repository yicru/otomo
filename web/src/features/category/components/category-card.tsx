import { CategoryTile } from '@/features/category/components/category-tile'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { PlusCircleIcon } from 'lucide-react'

const categories = [
  {
    id: '1',
    name: 'ALL',
    count: 120,
  },
  {
    id: '2',
    name: 'Unreal Engine 5',
    count: 5,
  },
  {
    id: '3',
    name: 'Game List',
    count: 11,
  },
  {
    id: '4',
    name: 'Game List',
    count: 51,
  },
]

export const CategoryCard = () => {
  return (
    <div className={'bg-[#EDEDED] px-4 rounded-lg'}>
      <div className={'flex justify-between items-center py-6 border-b'}>
        <p className={'font-serif text-2xl'}>
          <span>Finder</span>
          <span className={'text-xs ml-2'}>(26)</span>
        </p>
        <button>
          <PlusCircleIcon className={'h-5 w-5'} />
        </button>
      </div>

      <div className={'grid grid-cols-2 gap-x-5 gap-y-8 py-6'}>
        {categories.map((category) => (
          <CategoryTile key={category.id} category={category} />
        ))}
      </div>

      <div
        className={
          'w-full flex justify-center items-center text-center mt-4 pb-6'
        }
      >
        <button
          className={
            'inline-flex items-center rounded-[50%] border border-black py-3 px-8'
          }
        >
          <span className={'text-xs font-medium'}>View More</span>
          <ArrowRightIcon className={'h-4 w-4 ml-1'} />
        </button>
      </div>
    </div>
  )
}
