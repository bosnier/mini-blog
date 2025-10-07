import PostsFilters from "@/app/components/posts-filters"
import PostsList from "@/app/components/posts-list"

export default async function Page() {
  return (
    <div className="px-4 flex flex-col gap-5">
      <h1 className="text-2xl font-bold font-serif">All posts</h1>

      <PostsFilters filterAuthor />
      <PostsList appendSearchParams={new URLSearchParams([["truncateContent", "true"]])} />
    </div>
  )
}
