import { sql } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import GalleriesTable from "@/components/admin/galleries-table"
export const dynamic = "force-dynamic"

export default async function GalleriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; limit?: string; page?: string }>
}) {
  const params = await searchParams
  let query = `
    SELECT g.*, 
      (SELECT COUNT(*) FROM gallery_images WHERE gallery_id = g.id) as image_count
    FROM galleries g
    WHERE 1=1`
  const queryParams: any[] = []
  if (params.search) {
    queryParams.push(`%${params.search}%`)
    query += ` AND g.title ILIKE $${queryParams.length}`
  }
  query += ` ORDER BY g.created_at DESC`
  const limit = Number.parseInt(params.limit || '24')
  if (!Number.isNaN(limit) && limit > 0) {
    queryParams.push(Math.min(limit, 100))
    query += ` LIMIT $${queryParams.length}`
  }
  const page = Number.parseInt(params.page || '1')
  if (!Number.isNaN(page) && page > 1) {
    queryParams.push((page - 1) * Math.min(limit, 100))
    query += ` OFFSET $${queryParams.length}`
  }
  const galleriesResult = await sql.query(query, queryParams)
  const galleries = (galleriesResult && 'rows' in galleriesResult ? (galleriesResult as any).rows : galleriesResult) as any[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galerie</h1>
          <p className="text-gray-600 mt-1">Zarządzaj galeriami zdjęć</p>
        </div>
        <Link href="/admin/galleries/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nowa galeria
          </Button>
        </Link>
        <Link href="/admin/galleries/categories">
          <Button variant="outline" className="ml-3">Kategorie</Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form action="/admin/galleries" method="GET" className="flex-1 relative">
            <input
              name="search"
              placeholder="Szukaj galerii..."
              defaultValue={params.search}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="hidden" name="limit" value={String(limit)} />
            <input type="hidden" name="page" value={String(page)} />
          </form>
        </div>
        <GalleriesTable galleries={galleries || []} />
        <div className="flex items-center justify-between mt-6">
          {(() => {
            const limitNum = Math.min(limit, 100)
            const curr = Number.parseInt(params.page || "1")
            const prev = Math.max(1, curr - 1)
            const next = curr + 1
            return (
              <>
                <Link
                  href={{
                    pathname: "/admin/galleries",
                    query: {
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
                    pathname: "/admin/galleries",
                    query: {
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
