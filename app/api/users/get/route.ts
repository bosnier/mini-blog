import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = (url.searchParams.get("id") || "").trim()

  if (!id) return NextResponse.json({ user: undefined })

  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, name: true, image: true },
  })

  return NextResponse.json({ user })
}
