import Post, { PostType } from "@/app/components/post"
import { prisma } from "@/prisma"

export default async function Home() {
  console.log(await prisma.user.findMany())

  const posts: PostType[] = [
    {
      id: "0",
      title: "Lorem ipsum dolor sit amet.",
      content: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, maxime!",
      author: { id: "0", name: "Bobsner" },
    },
    {
      id: "1",
      title: "Some other post.",
      content: "Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные.",
      author: { id: "0", name: "Bobsner" },
    },
  ]

  return (
    <main className="p-2 flex flex-col gap-2 max-w-3xl mx-auto w-full">
      <button className="bg-stone-700 px-2 py-1 rounded-md max-w-48">Write new post</button>
      <Post post={posts[0]} />
      <Post post={posts[1]} />
    </main>
  )
}
