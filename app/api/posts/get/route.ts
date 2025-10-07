import { parsePostsFilters } from "@/app/lib/posts-filters-utils"
import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

// TODO add `trimContent` and `includeUnpublished` flags
// don't forget to check ownership

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  const { q, author, sort } = parsePostsFilters(url.searchParams)
  const trimContent = searchParams.get("trimContent")
  const from = searchParams.get("from")
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "5"), 5), 100)

  const posts = await prisma.post.findMany({
    take: limit,
    skip: from ? 1 : 0,
    cursor: from ? { id: from } : undefined,
    where: {
      published: true,
      title: { contains: q, mode: "insensitive" },
      author: { id: author },
    },
    include: { author: true },
    orderBy: [{ createdAt: sort === "older" ? "asc" : "desc" }, { id: "desc" }],
  })

  const hasMore = posts.length === limit

  return NextResponse.json({ posts, hasMore })
}
