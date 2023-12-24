import { NewArticleCard } from '@/features/article/components/new-article-card'
import { RecentArticlesCard } from '@/features/article/components/recent-articles-card'
import { CategoryCard } from '@/features/category/components/category-card'
import { createHonoClient } from '@/lib/hono/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const client = createHonoClient()
  const result = await client.api.auth.me.$get()
  const { me } = await result.json()

  if (!me) {
    return redirect('/auth/sign-in')
  }

  return (
    <div className={'grid gap-1.5 p-1.5 pb-16'}>
      <NewArticleCard />
      <RecentArticlesCard />
      <CategoryCard />
    </div>
  )
}
