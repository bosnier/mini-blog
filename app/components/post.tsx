import Link from "next/link"

export type PostType = {
  id: string
  title: string
  content: string
  author: User
  createdAt: Date
}

export type User = {
  id: string
  name: string | null
}

export default function Post({ post }: { post: PostType }) {
  return (
    <section className="flex flex-col gap-1 items-start">
      <Link href={"/posts/" + post.id} className="text-lg font-medium line-clamp-2 leading-tight">
        {post.title}
      </Link>
      <p className="text-sm text-muted-foreground line-clamp-4">{post.content}</p>
      <span className="text-sm text-muted-foreground">
        <Link href={"/profile/" + post.author.id} className="text-sm text-foreground">
          {post.author.name}
        </Link>
        , {post.createdAt.toLocaleString()}
      </span>
    </section>
  )
}
