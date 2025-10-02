import { signIn } from "@/auth"

export default function SignIn() {
  async function submit() {
    "use server"
    await signIn("github", { redirectTo: "/" })
  }

  return (
    <form action={submit}>
      <button type="submit" className="px-3 py-2 rounded-md bg-stone-900 cursor-pointer">
        Sign in using GitHub
      </button>
    </form>
  )
}
