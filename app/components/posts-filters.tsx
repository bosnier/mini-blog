"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parsePostsFilters, PostsSearchParams } from "@/app/lib/posts-filters-utils"
import { AsyncSelect } from "@/components/ui/async-select"
import { useEffect, useState } from "react"
import { useDebounce } from "../lib/hooks/use-debounce"

export default function PostsFilters({ filterAuthor }: { filterAuthor?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { q, author, sort } = parsePostsFilters(searchParams)

  const [query, setQuery] = useState(q || "")
  const debouncedQuery = useDebounce(query, 300)
  useEffect(() => updateURL({ q: debouncedQuery }), [debouncedQuery])

  const [selectedAuthor, setSelectedAuthor] = useState(author || "")

  function setAuthor(authorId: string) {
    setSelectedAuthor(authorId)
    updateURL({ author: authorId })
  }

  function updateURL(newParams: PostsSearchParams) {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([name, value]) => params.set(name, value))
    router.push(pathname + "?" + params)
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Input
        type="search"
        placeholder="Find post by title..."
        defaultValue={q || ""}
        onChange={(e) => setQuery(e.target.value)}
        className="w-auto grow min-w-64"
      />
      {filterAuthor && (
        <AsyncSelect
          fetcher={
            async (query?: string) =>
              fetch("/api/users/search?q=" + query)
                .then((r) => r.json())
                .then((r) => r.users as { id: string; name: string }[])
            // TODO catch errors?
          }
          renderOption={(user) => user.name}
          getOptionValue={(user) => user.id}
          getDisplayValue={(user) => "By " + user.name}
          notFound={<div className="px-3 pt-2 text-sm">No authors found</div>}
          label="Author"
          placeholder="Find author..."
          value={selectedAuthor}
          onChange={setAuthor}
          width="25ch"
        />
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
