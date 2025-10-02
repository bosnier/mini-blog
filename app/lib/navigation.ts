import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function redirectToOwnProfile() {
  const session = await auth()
  if (session?.user) {
    redirect("/profile/" + session.user.id)
  }
}
