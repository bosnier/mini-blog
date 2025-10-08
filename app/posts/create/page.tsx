import PostCreationForm from "@/app/components/post-creation-form"

export default function Page() {
  return (
    <div className="px-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold font-serif">Create post</h2>
      <PostCreationForm />
    </div>
  )
}
