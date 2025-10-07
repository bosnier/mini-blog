import PostsFilters from "@/app/components/posts-filters"
import { PostsSearchParams } from "@/app/lib/posts-filters-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/prisma"
import { ImageOff, Plus } from "lucide-react"
import PostsList from "@/app/components/posts-list"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function Page(props: {
  searchParams?: Promise<PostsSearchParams>
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  const { id } = await props.params

  const user = await prisma.user.findFirst({ where: { id } })
  // TODO should handle not found error
  if (!user) return "not found"

  const params = new URLSearchParams([
    ["author", id],
    ["includeUnpublished", "true"],
    ["truncateContent", "true"],
  ])

  return (
    <div className="px-4 flex flex-col gap-5">
      <div className="flex gap-3 items-center flex-wrap">
        <Avatar className="size-16 -z-10">
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>
            <ImageOff />
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-2xl wrap-break-word overflow-hidden">{user.name}</span>
        {session?.user?.id === id && (
          <Button className="ms-auto">
            <Plus />
            New post
          </Button>
        )}
      </div>

      <PostsFilters />
      <PostsList appendSearchParams={params} />
    </div>
  )
}
