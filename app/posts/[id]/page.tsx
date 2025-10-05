import { prisma } from "@/prisma"
import Link from "next/link"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findFirst({ where: { id }, include: { author: true } })

  // TODO should handle not found error
  if (!post) return "not found"

  return (
    <div className="px-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold font-serif">{post.title}</h2>
      <div className="flex justify-between">
        <Link href={"/profile/" + post.author.id}>{post.author.name}</Link>
        <span className="self-end ">{post.createdAt.toLocaleString()}</span>
      </div>
      <span className="">{post.content}</span>
    </div>
  )
}
