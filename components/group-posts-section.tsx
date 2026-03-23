"use client"

import { useEffect, useState } from "react"
import { Calendar, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Post {
  id: string
  title: string
  excerpt: string
  content?: string
  image_url: string | null
  created_at: string
  group_category: string | null
  type?: string
  slug?: string | null
  add_to_calendar?: boolean
  calendar_date?: string | null
  calendar_end_date?: string | null
}

interface GroupPostsSectionProps {
  groupSlug: string
}

export default function GroupPostsSection({ groupSlug }: GroupPostsSectionProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGroupPosts() {
      try {
        const response = await fetch(`/api/posts?group=${groupSlug}&status=published&limit=6`)

        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }

        const data = await response.json()
        setPosts(data || [])
      } catch (error) {
        console.error("[v0] Error fetching group posts:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchGroupPosts()
  }, [groupSlug])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5dfd8] mb-12">
        <h2 className="text-2xl font-bold text-[#443b32] mb-4">Aktualności dla Grupy</h2>
        <p className="text-[#6b5f52]">Ładowanie aktualności...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5dfd8] mb-12">
      <h2 className="text-2xl font-bold text-[#443b32] mb-6">Aktualności dla Grupy</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.type || 'aktualnosci'}/${post.slug}`}
            className="group rounded-xl overflow-hidden border border-[#e5dfd8] hover:border-[#443b32] transition-all hover:shadow-lg"
          >
            {post.image_url && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image_url || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-[#443b32] mb-2 group-hover:text-[#6fc0e8] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div
                className="text-sm text-[#6b5f52] mb-3 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.excerpt || post.content || "" }}
              />
              <div className="flex flex-col gap-2 text-xs text-[#6b5f52]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_at).toLocaleDateString("pl-PL")}
                  </span>
                  <span className="flex items-center gap-1 text-[#2f67ab] group-hover:text-[#6fc0e8]">
                    <Eye className="w-3 h-3" />
                    Czytaj więcej
                  </span>
                </div>
                {post.add_to_calendar && post.calendar_date && (
                  <span className="flex items-center gap-1 font-medium text-[#2f67ab]">
                    <Calendar className="w-3 h-3" />
                    Wydarzenie: {new Date(post.calendar_date).toLocaleDateString("pl-PL")}
                    {post.calendar_end_date && ` - ${new Date(post.calendar_end_date).toLocaleDateString("pl-PL")}`}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
