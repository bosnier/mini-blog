"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Post, { PostType } from "@/components/features/posts/post"
import { LoaderCircle } from "lucide-react"

export default function PostsList({ appendSearchParams }: { appendSearchParams?: URLSearchParams }) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string>()

  const abortController = useRef<AbortController>(undefined)

  const originalSearchParams = useSearchParams()
  const searchParams = useMemo(() => {
    if (!appendSearchParams) return originalSearchParams
    return new URLSearchParams([...originalSearchParams, ...appendSearchParams])
  }, [originalSearchParams, appendSearchParams])
  useEffect(() => {
    setHasMore(true)
    setCursor(undefined)
    setPosts([])
    abortController.current?.abort()
  }, [searchParams])

  const fetchPosts = useCallback(
    (cursor?: string) => {
      if (!hasMore || loading) return
      setLoading(true)
      abortController.current = new AbortController()
      const query = new URLSearchParams(searchParams.toString())
      if (cursor) query.set("from", cursor)

      fetch("/api/posts/get?" + query.toString(), { signal: abortController.current?.signal })
        .then((r) => r.json())
        .then((r: { posts: PostType[]; hasMore: boolean }) => {
          const fetchedPosts = r.posts.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
          setPosts((prev) => [...prev, ...fetchedPosts])
          setCursor(r.posts[r.posts.length - 1]?.id)
          setHasMore(r.hasMore || r.posts.length !== 0)
        })
        .catch((e: Error) => {
          if (e.name === "AbortError") return
          console.error(e)
        })
        .finally(() => setLoading(false))
    },
    [searchParams, loading, hasMore]
  )

  const sentinelRef = useRef(null)
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && hasMore) fetchPosts(cursor)
      })
    })
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [fetchPosts, cursor, loading, hasMore])

  return (
    <>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {loading && <LoaderCircle className="animate-spin self-center" />}
      {!loading && !hasMore && (
        <span className="text-muted-foreground self-center">{posts.length ? `That's all` : `No posts`}</span>
      )}
      <div ref={sentinelRef} className="h-px" />
    </>
  )
}
