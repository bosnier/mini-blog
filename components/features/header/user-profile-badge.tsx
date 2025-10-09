import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Session } from "next-auth"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function UserProfileBadge({ session, className }: { session: Session; className?: string }) {
  const user = session.user
  if (!user) return "No user"

  return (
    <Link href={"/profile/" + user.id} className={cn("flex gap-2 items-center h-fit", className)}>
      {user.image && (
        <Avatar>
          <AvatarImage src={user.image} />
        </Avatar>
      )}
    </Link>
  )
}
