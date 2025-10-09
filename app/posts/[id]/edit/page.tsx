import PostForm from "@/app/components/post-form"
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit post",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return <div className="mx-auto text-2xl">You should sign in first</div>

  const { id } = await params
  const post = await prisma.post.findFirst({
    where: { id },
  })

  if (!post) return "Post not found"

  if (post.userId !== session.user?.id) {
    redirect("/posts/" + post.id)
  }

  return (
    <div className="px-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold font-serif">Edit post</h2>
      <PostForm mode="update" initialValues={{ title: post.title, content: post.content, published: post.published }} />
    </div>
  )
}
