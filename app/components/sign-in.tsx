import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  async function submit() {
    "use server"
    await signIn("github", { redirectTo: "/" })
  }

  return (
    <form action={submit}>
      <Button type="submit" variant="secondary">
        Sign in using GitHub
      </Button>
    </form>
  )
}
