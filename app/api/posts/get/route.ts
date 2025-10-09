import { parsePostsFilters } from "@/app/lib/posts-filters-utils"
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const searchParams = url.searchParams
  const session = await auth()

  const { q, author, sort } = parsePostsFilters(url.searchParams)
  const truncateContent = searchParams.get("truncateContent")
  const includeUnpublished = searchParams.get("includeUnpublished")
  const from = searchParams.get("from")
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "5"), 5), 100)

  const showUnpublished = session?.user?.id === author && includeUnpublished === "true"

  const posts = await prisma.post.findMany({
    take: limit,
    skip: from ? 1 : 0,
    cursor: from ? { id: from } : undefined,
    where: {
      published: showUnpublished ? undefined : true,
      title: { contains: q, mode: "insensitive" },
      author: { id: author },
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: [{ createdAt: sort === "older" ? "asc" : "desc" }, { id: "desc" }],
  })

  const hasMore = posts.length === limit

  if (truncateContent === "true") {
    const truncatedPosts = posts.map((post) => ({ ...post, content: post.content.slice(0, 500) }))
    return NextResponse.json({ posts: truncatedPosts, hasMore })
  }

  return NextResponse.json({ posts, hasMore })
}
