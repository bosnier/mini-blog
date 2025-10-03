import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export default function SignIn() {
  async function submit() {
    "use server"
    await signIn("github", { redirectTo: "/" })
  }

  return (
    <form action={submit}>
      <Button type="submit" variant="secondary">
        <Github />
        Sign in using GitHub
      </Button>
    </form>
  )
}
