import { Otomo } from '@/components/otomo'
import { CreateArticleForm } from '@/features/article/components/create-article-form'

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

      <div className={'w-full mt-6'}>
        <CreateArticleForm />
      </div>
    </div>
  )
}
