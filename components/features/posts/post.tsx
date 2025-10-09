import Link from "next/link"

export type PostType = {
  id: string
  title: string
  content: string
  author?: User
  createdAt: Date
  published?: boolean
}

export type User = {
  id: string
  name: string | null
}

export default function Post({ post }: { post: PostType }) {
  return (
    <section className="flex flex-col gap-1 items-start overflow-hidden">
      <Link href={"/posts/" + post.id} className="text-lg font-medium line-clamp-2 leading-tight break-words w-full">
        {post.title}
      </Link>
      <p className="text-sm text-muted-foreground line-clamp-4 break-words w-full">{post.content}</p>
      <span className="text-sm text-muted-foreground">
        {post.author && (
          <>
            <Link href={"/profile/" + post.author.id} className="text-sm text-foreground font-medium">
              {post.author.name}
            </Link>
            ,&nbsp;
          </>
        )}
        {post.createdAt.toLocaleString()}
        {!post.published && (
          <span className="bg-chart-3 text-xs text-background ms-1 px-1 rounded-sm">unpublished</span>
        )}
      </span>
    </section>
  )
}
