import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  const id = searchParams.get("id")

  if (!id) return NextResponse.json({ user: undefined })

  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, name: true, image: true },
  })

  return NextResponse.json({ user })
}
