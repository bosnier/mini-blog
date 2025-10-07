import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  const q = searchParams.get("q") || ""
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "15"), 15), 30)

  const users = await prisma.user.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    select: { id: true, name: true, image: true },
    take: limit,
  })

  return NextResponse.json({ users })
}
