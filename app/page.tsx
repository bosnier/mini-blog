import Post from "@/app/components/post"
import { Button } from "@/components/ui/button"
import { prisma } from "@/prisma"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function Page() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 4,
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="px-4 flex flex-col gap-5">
      <h1 className="text-2xl font-bold font-serif">Latest posts</h1>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      <div className="flex gap-1 mt-2">
        <Link href="/posts" className="grow">
          <Button variant="default" className="w-full">
            Read more
          </Button>
        </Link>
        <Button variant="outline" className="self-start">
          <Plus />
          Write new post
        </Button>
      </div>
    </div>
  )
}
