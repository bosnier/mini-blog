"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, ChevronsUpDown } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parsePostsFilters, PostsSearchParams } from "@/app/lib/posts-filters-utils"
import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "@/app/lib/hooks/use-debounce"

export default function PostsFilters({ filterAuthor }: { filterAuthor?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { q, author, sort } = parsePostsFilters(searchParams)

  const updateURL = useCallback(
    (newParams: PostsSearchParams) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(newParams).forEach(([name, value]) => (value ? params.set(name, value) : params.delete(name)))
      router.push(pathname + "?" + params)
    },
    [searchParams, pathname, router]
  )

  const [query, setQuery] = useState(q || "")
  const debouncedQuery = useDebounce(query, 300)
  useEffect(() => {
    updateURL({ q: debouncedQuery })
  }, [debouncedQuery, updateURL])

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Input
        type="search"
        name="search"
        placeholder="Find post by title..."
        defaultValue={q || ""}
        onChange={(e) => setQuery(e.target.value)}
        className="w-auto grow min-w-64"
      />

      {filterAuthor && <AuthorSearch defaultValue={author} onAuthorSelect={(author) => updateURL({ author })} />}

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

type User = { id: string; name: string }
function AuthorSearch({
  defaultValue,
  onAuthorSelect,
}: {
  defaultValue?: string
  onAuthorSelect: (author?: string) => void
}) {
  useEffect(() => {
    fetch("/api/users/get?id=" + defaultValue)
      .then((r) => r.json())
      .then((r: { user?: User }) => {
        if (r.user) setSelectedAuthor(r.user)
      })
    // catch errors?
  }, [defaultValue])

  const [selectedAuthor, setSelectedAuthor] = useState<User>()
  const [authors, setAuthors] = useState<User[]>([])

  function selectAuthor(author: User) {
    const newAuthor = author.id === selectedAuthor?.id ? undefined : author
    setSelectedAuthor(newAuthor)
    onAuthorSelect(newAuthor?.id)
  }

  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 150)
  useEffect(() => {
    setLoading(true)
    fetch("/api/users/search?q=" + debouncedQuery)
      .then((r) => r.json())
      .then((r: { users: User[] }) => {
        setAuthors(r.users)
        setLoading(false)
      })
  }, [debouncedQuery])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-36 justify-between font-normal">
          {selectedAuthor ? "By " + selectedAuthor.name : "By author"}
          <ChevronsUpDown className="text-ring" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Find author..."
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            value={query}
          />
          <CommandList className="pt-1">
            {loading && <div className="py-6 text-center text-sm">Loading...</div>}
            {!loading && <CommandEmpty>No author found</CommandEmpty>}
            {!loading &&
              authors.map((author) => (
                <CommandItem value={author.id} key={author.id} onSelect={() => selectAuthor(author)}>
                  {author.id === selectedAuthor?.id && <Check />}
                  {author.name}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
