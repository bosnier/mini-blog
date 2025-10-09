"use server"

import z from "zod"
import { PostFormSchema } from "./schemas"
import { prisma } from "@/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

type PostFormType = z.infer<typeof PostFormSchema>

export async function createPost(formData: PostFormType) {
  const validatedFields = PostFormSchema.safeParse(formData)
  if (!validatedFields.success) {
    return { error: "Validation error", details: validatedFields.error }
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return { error: "You must be authorized to create a post" }
  }
  // is situation when user not exists in db possible?

  const form = validatedFields.data
  const post = await prisma.post.create({
    data: { title: form.title, content: form.content, published: form.published, userId },
  })

  redirect("/posts/" + post.id)
}

export async function updatePost(formData: PostFormType, postId: string) {
  const validatedFields = PostFormSchema.safeParse(formData)
  if (!validatedFields.success) {
    return { error: "Validation error", details: validatedFields.error }
  }

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return { error: "You must be authorized to update the post" }
  }

  const userIsAuthor = await prisma.post.findFirst({
    where: { id: postId, userId },
    select: { id: true },
  })
  if (!userIsAuthor) {
    return { error: "You must be the author of this post to update it" }
  }

  const form = validatedFields.data
  const post = await prisma.post.update({
    where: { id: postId },
    data: { title: form.title, content: form.content, published: form.published },
  })

  if (!post) {
    return { error: "Post not found" }
  }

  redirect("/posts/" + postId)
}

export async function deletePost(postId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return { error: "You must be authorized to delete the post" }
  }

  const post = await prisma.post.findFirst({
    where: { id: postId },
    select: { id: true, userId: true },
  })
  if (userId !== post?.userId) {
    return { error: "You must be the author of this post to delete it" }
  }

  await prisma.post.delete({
    where: { id: postId },
  })

  redirect("/posts")
}
