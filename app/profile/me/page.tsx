import { redirectToOwnProfile } from "@/app/lib/navigation"

export default async function Page() {
  await redirectToOwnProfile()
}
