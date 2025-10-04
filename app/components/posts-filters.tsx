"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRoundSearch } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parsePostsFilters, PostsSearchParams } from "@/app/lib/posts-filters-utils"

export default function PostsFilters({ filterAuthor }: { filterAuthor?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { q, author, sort } = parsePostsFilters(searchParams)

  // TODO add debounce
  function updateURL(newParams: PostsSearchParams) {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([name, value]) => params.set(name, value))
    router.push(pathname + "?" + params)
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        type="search"
        placeholder="Find post..."
        defaultValue={q || ""}
        onChange={(e) => updateURL({ q: e.target.value })}
      />
      {filterAuthor && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              By author
              <UserRoundSearch />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Find author..." />
              <CommandList>
                <CommandEmpty>No author found</CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      <Select defaultValue={sort || "newer"} onValueChange={(value: "newer" | "older") => updateURL({ sort: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newer">Newer first</SelectItem>
          <SelectItem value="older">Older first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
