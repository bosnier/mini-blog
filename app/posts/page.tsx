import { prisma } from "@/prisma"
import Post from "@/app/components/post"

export default async function Page() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 10,
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="px-4 flex flex-col gap-5 max-w-3xl mx-auto w-full pb-8">
      <h1 className="text-2xl font-bold font-serif">All posts</h1>

      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </main>
  )
}
