import PostCreationForm from "@/app/components/post-creation-form"
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()
  if (!session) return <div className="mx-auto text-2xl">You should sign in first</div>

  return (
    <div className="px-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold font-serif">Create post</h2>
      <PostCreationForm />
    </div>
  )
}
