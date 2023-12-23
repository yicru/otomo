import { Otomo } from '@/components/otomo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MicIcon } from 'lucide-react'

export const NewArticleCard = () => {
  return (
    <div
      className={
        'relative flex flex-col items-center py-8 px-7 bg-[#F9DC4A] rounded-lg'
      }
    >
      <img
        src={'/images/new-article-pattern.png'}
        className={
          'absolute inset-0 object-contain object-top mix-blend-color-burn'
        }
        alt=""
      />

      <Otomo className={'h-20'} />

      <p className={'font-serif text-[2rem] leading-[1.1] text-center mt-8'}>
        What article
        <br />
        Do you Listen today?
      </p>

      <p className={'mt-4'}>今日はどんな記事を聞く？</p>

      <div className={'relative w-full mt-6'}>
        <Input
          placeholder={'Add Link...'}
          className={'py-5 pl-4 pr-16 bg-white border-black'}
        />
        <Button className={'absolute h-auto top-1 bottom-1 right-1'}>
          <MicIcon className={'h-4 w-4'} />
        </Button>
      </div>
    </div>
  )
}
