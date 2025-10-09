import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { prisma } from "@/prisma"
import { Pencil } from "lucide-react"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findFirst({
    where: { id },
    select: { author: { select: { name: true } } },
  })

  return {
    title: (post?.author.name || "Someone") + `'s post`,
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const userId = session?.user?.id

  const { id } = await params
  const post = await prisma.post.findFirst({ where: { id }, include: { author: true } })

  const userIsAuthor = post?.userId === userId
  if (!post || (!post?.published && !userIsAuthor)) {
    return <div className="mx-auto text-2xl">Post not found</div>
  }

  return (
    <div className="px-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold font-serif break-words">{post.title}</h2>
      <div className="flex justify-between items-center flex-wrap">
        <Link href={"/profile/" + post.author.id}>{post.author.name}</Link>
        {!post.published && (
          <span className="bg-chart-3 text-xs text-background px-1 rounded-sm me-auto ms-1">unpublished</span>
        )}
        <span className="self-end">{post.createdAt.toLocaleString()}</span>
      </div>
      {userIsAuthor && (
        <Link href={"/posts/" + id + "/edit"} className="self-end">
          <Button>
            <Pencil />
            Edit
          </Button>
        </Link>
      )}
      <span className="whitespace-pre-wrap break-words">{post.content}</span>
    </div>
  )
}
