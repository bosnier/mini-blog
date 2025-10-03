import Post, { PostType } from "@/app/components/post"
import { Button } from "@/components/ui/button"
import { prisma } from "@/prisma"
import { Plus } from "lucide-react"

export default async function Home() {
  console.log(await prisma.user.findMany())

  const posts = await prisma.post.findMany({ where: { published: true }, take: 4, include: { author: true } })

  return (
    <main className="p-2 flex flex-col gap-5 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold font-serif">Latest posts</h1>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      <div className="flex gap-1 mt-2">
        <Button variant="default" className="grow">
          Read more
        </Button>
        <Button variant="outline" className="self-start">
          <Plus />
          Write new post
        </Button>
      </div>
    </main>
  )
}
