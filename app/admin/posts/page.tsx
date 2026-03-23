import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import PostsTable from "@/components/admin/posts-table"
import { Input } from "@/components/ui/input"
import { sql } from "@/lib/db"
export const dynamic = "force-dynamic"

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; search?: string; limit?: string; page?: string }>
}) {
  const params = await searchParams
  let query = "SELECT * FROM posts WHERE 1=1"
  const queryParams: any[] = []

  if (params.type) {
    queryParams.push(params.type)
    query += ` AND type = $${queryParams.length}`
  }

  if (params.status) {
    queryParams.push(params.status)
    query += ` AND status = $${queryParams.length}`
  }

  if (params.search) {
    queryParams.push(`%${params.search}%`)
    query += ` AND title ILIKE $${queryParams.length}`
  }

  query += " ORDER BY created_at DESC"

  const limit = Number.parseInt(params.limit || "50")
  if (!Number.isNaN(limit) && limit > 0) {
    queryParams.push(Math.min(limit, 200))
    query += ` LIMIT $${queryParams.length}`
  }
  const page = Number.parseInt(params.page || "1")
  if (!Number.isNaN(page) && page > 1) {
    queryParams.push((page - 1) * Math.min(limit, 200))
    query += ` OFFSET $${queryParams.length}`
  }

  const postsResult = await sql.query(query, queryParams)
  const posts = (postsResult && 'rows' in postsResult ? (postsResult as any).rows : postsResult) as any[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posty</h1>
          <p className="text-gray-600 mt-1">Zarządzaj aktualnościami, ogłoszeniami i konkursami</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            Nowy post
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form action="/admin/posts" method="GET" className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input name="search" placeholder="Szukaj postów..." className="pl-10" defaultValue={params.search} />
            <input type="hidden" name="type" value={params.type || ""} />
            <input type="hidden" name="status" value={params.status || ""} />
            <input type="hidden" name="limit" value={String(limit)} />
            <input type="hidden" name="page" value={String(page)} />
          </form>
          <div className="flex gap-2">
            <Link
              href="/admin/posts"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !params.type ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Wszystkie
            </Link>
            <Link
              href="/admin/posts?type=aktualnosci"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                params.type === "aktualnosci"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Aktualności
            </Link>
            <Link
              href="/admin/posts?type=ogloszenia"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                params.type === "ogloszenia"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ogłoszenia
            </Link>
            <Link
              href="/admin/posts?type=konkursy"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                params.type === "konkursy"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Konkursy
            </Link>
            <Link
              href="/admin/posts?type=okiem-specjalisty"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                params.type === "okiem-specjalisty"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Okiem specjalisty
            </Link>
          </div>
        </div>

        <PostsTable posts={posts || []} />
        <div className="flex items-center justify-between mt-6">
          {(() => {
            const limitNum = Math.min(limit, 200)
            const curr = Number.parseInt(params.page || "1")
            const prev = Math.max(1, curr - 1)
            const next = curr + 1
            return (
              <>
                <Link
                  href={{
                    pathname: "/admin/posts",
                    query: {
                      type: params.type || undefined,
                      status: params.status || undefined,
                      search: params.search || undefined,
                      limit: String(limitNum),
                      page: String(prev),
                    },
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Poprzednia
                </Link>
                <Link
                  href={{
                    pathname: "/admin/posts",
                    query: {
                      type: params.type || undefined,
                      status: params.status || undefined,
                      search: params.search || undefined,
                      limit: String(limitNum),
                      page: String(next),
                    },
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Następna
                </Link>
              </>
            )
          })()}
        </div>
      </Card>
    </div>
  )
}
