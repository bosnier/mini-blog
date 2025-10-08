"use server"

import z from "zod"
import { PostFormSchema } from "./schemas"
import { NextResponse } from "next/server"
import { prisma } from "@/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function createPost(formData: z.infer<typeof PostFormSchema>) {
  const validatedFields = PostFormSchema.safeParse(formData)
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Validation error" }, { status: 400 })
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: "You must be authorized to create a post" }, { status: 401 })
  }
  // is situation when user not exists in db possible?

  const form = validatedFields.data
  const post = await prisma.post.create({
    data: { title: form.title, content: form.content, published: form.published, userId },
  })

  redirect("/posts/" + post.id)
}
