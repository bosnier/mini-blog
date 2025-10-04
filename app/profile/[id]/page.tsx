import Post from "@/app/components/post"
import PostsFilters from "@/app/components/posts-filters"
import { parsePostsFilters, PostsSearchParams } from "@/app/lib/posts-filters-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/prisma"
import { ImageOff, NotepadText } from "lucide-react"

// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
export default async function Page(props: {
  searchParams?: Promise<PostsSearchParams>
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const user = await prisma.user.findFirst({ where: { id } })
  // TODO should handle not found error
  if (!user) return "not found"

  const searchParams = new URLSearchParams(await props.searchParams)
  const { q, sort } = parsePostsFilters(searchParams)

  const posts = await prisma.post.findMany({
    where: { author: { id }, title: { contains: q } },
    orderBy: { createdAt: sort === "older" ? "asc" : "desc" },
  })

  return (
    <main className="px-4 flex flex-col gap-5 max-w-3xl mx-auto w-full pb-8">
      <div className="flex gap-3 items-center">
        <Avatar className="size-16 -z-10">
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>
            <ImageOff />
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-2xl">{user.name}</span>
      </div>

      <PostsFilters />

      {posts.length ? (
        posts.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground justify-center">
          <NotepadText />
          No posts
        </div>
      )}
    </main>
  )
}
