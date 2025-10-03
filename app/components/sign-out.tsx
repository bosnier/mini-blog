import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default function SignOut() {
  async function submit() {
    "use server"
    await signOut({ redirectTo: "/" })
  }

  return (
    <form action={submit}>
      <Button type="submit" variant="secondary">
        Signout
      </Button>
    </form>
  )
}
