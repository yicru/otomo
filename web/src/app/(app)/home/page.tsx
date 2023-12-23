import { NewArticleCard } from '@/features/article/components/new-article-card'
import { RecentArticlesCard } from '@/features/article/components/recent-articles-card'

export default function Home() {
  return (
    <div className={'grid gap-1.5 p-1.5'}>
      <NewArticleCard />
      <RecentArticlesCard />
    </div>
  )
}
