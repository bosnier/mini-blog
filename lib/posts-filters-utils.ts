export type PostsSearchParams = { q?: string; author?: string; sort?: "newer" | "older" }

export function parsePostsFilters(searchParams: URLSearchParams) {
  const filters: PostsSearchParams = {}

  filters.q = searchParams.get("q") || undefined
  filters.author = searchParams.get("author") || undefined
  filters.sort = (["newer", "older"] as const).find((item) => item === searchParams.get("sort"))

  return filters
}
