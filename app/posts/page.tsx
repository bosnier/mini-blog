import { prisma } from "@/prisma"
import Post from "@/app/components/post"
import PostsFilters from "@/app/components/posts-filters"
import { parsePostsFilters, PostsSearchParams } from "@/app/lib/posts-filters-utils"

export default async function Page(props: { searchParams?: Promise<PostsSearchParams> }) {
  const searchParams = new URLSearchParams(await props.searchParams)
  const { q, author, sort } = parsePostsFilters(searchParams)

  const posts = await prisma.post.findMany({
    where: { published: true, title: { contains: q, mode: "insensitive" }, author: { id: author } },
    take: 10,
    include: { author: true },
    orderBy: { createdAt: sort === "older" ? "asc" : "desc" },
  })
  const truncatedPosts = posts.map((post) => ({ ...post, content: post.content.slice(0, 500) }))

  return (
    <main className="px-4 flex flex-col gap-5 max-w-3xl mx-auto w-full pb-8">
      <h1 className="text-2xl font-bold font-serif">All posts</h1>

      <PostsFilters filterAuthor />

      {truncatedPosts.length ? truncatedPosts.map((post) => <Post post={post} key={post.id} />) : "No posts found"}
    </main>
  )
}
