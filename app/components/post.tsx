import Link from "next/link"

export type PostType = {
  id: string
  title: string
  content: string
  author: User
  // TODO
  createdAt?: string
}

export type User = {
  id: string
  name: string
}

export default function Post({ post }: { post: PostType }) {
  return (
    <section className="flex flex-col px-3 py-2 gap-1 items-start">
      <Link href={"/posts/" + post.id} className="text-lg">
        {post.title}
      </Link>
      <p className="text-sm text-stone-300">{post.content}</p>
      <span className="text-sm text-stone-400">
        ©
        <Link href={"/profile/" + post.author.id} className="text-sm text-indigo-300">
          {post.author.name}
        </Link>
        , {new Date().toDateString()}
      </span>
    </section>
  )
}
