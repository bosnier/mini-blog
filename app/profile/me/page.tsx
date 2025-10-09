import { redirectToOwnProfile } from "@/lib/navigation"

export default async function Page() {
  await redirectToOwnProfile()
}
