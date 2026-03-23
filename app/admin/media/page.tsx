import { sql } from "@/lib/db"
import { list } from "@vercel/blob"
import { Card } from "@/components/ui/card"
import MediaGrid from "@/components/admin/media-grid"
import MediaUpload from "@/components/admin/media-upload"
export const dynamic = "force-dynamic"

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; search?: string; limit?: string; page?: string }>
}) {
  const params = await searchParams

  const limit = Math.min(Number.parseInt(params.limit || "40"), 200)
  const page = Math.max(1, Number.parseInt(params.page || "1"))

  const dbResult = await sql.query("SELECT * FROM media ORDER BY created_at DESC")
  const dbMedia = (dbResult && 'rows' in dbResult ? (dbResult as any).rows : dbResult) as any[]

  const { blobs } = await list()

  function inferType(name: string) {
    const n = name.toLowerCase()
    if (n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.png') || n.endsWith('.webp') || n.endsWith('.gif')) return 'image'
    if (n.endsWith('.pdf')) return 'pdf'
    return 'file'
  }
  function inferCategory(pathname: string) {
    const p = pathname.toLowerCase()
    if (p.includes('/gallery') || p.includes('/galeria')) return 'gallery'
    if (p.includes('/menu') || p.includes('/jadlospis')) return 'menu'
    return 'document'
  }

  const blobMedia = (blobs || []).map((b: any) => ({
    id: null,
    file_url: b.url,
    file_name: b.pathname?.split('/')?.pop() || b.pathname || 'plik',
    file_type: inferType(b.pathname || ''),
    category: inferCategory(b.pathname || ''),
    created_at: b.uploadedAt || null,
    subcategory: null,
  }))

  const mergedMap = new Map<string, any>()
  for (const m of blobMedia) mergedMap.set(m.file_url, m)
  for (const m of dbMedia) {
    const key = m.file_url || m.image_url || m.url
    mergedMap.set(key, { ...mergedMap.get(key), ...m })
  }
  let media = Array.from(mergedMap.values())

  if (params.type) media = media.filter((m) => (m.file_type || '').toLowerCase() === params.type)
  if (params.category) media = media.filter((m) => (m.category || '').toLowerCase() === params.category)
  if (params.search) {
    const s = params.search.toLowerCase()
    media = media.filter((m) => ((m.file_name || '').toLowerCase().includes(s) || (m.file_url || '').toLowerCase().includes(s)))
  }

  media.sort((a, b) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0
    return tb - ta
  })

  const start = (page - 1) * limit
  const end = start + limit
  media = media.slice(start, end)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media i dokumenty</h1>
          <p className="text-gray-600 mt-1">Zarządzaj zdjęciami, dokumentami i plikami PDF</p>
        </div>
      </div>

      <MediaUpload />

      <Card className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <form action="/admin/media" method="GET" className="flex-1">
            <input
              name="search"
              placeholder="Szukaj plików..."
              defaultValue={params.search}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="hidden" name="type" value={params.type || ""} />
            <input type="hidden" name="category" value={params.category || ""} />
            <input type="hidden" name="limit" value={String(limit)} />
            <input type="hidden" name="page" value={String(page)} />
          </form>
          <a
            href="/admin/media"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !params.type && !params.category
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Wszystkie
          </a>
          <a
            href="/admin/media?type=image"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.type === "image" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Zdjęcia
          </a>
          <a
            href="/admin/media?type=pdf"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.type === "pdf" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            PDF
          </a>
          <a
            href="/admin/media?category=gallery"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.category === "gallery"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Galeria
          </a>
          <a
            href="/admin/media?category=document"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.category === "document"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Dokumenty
          </a>
          <a
            href="/admin/media?category=menu"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              params.category === "menu" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Jadłospis
          </a>
        </div>

        <MediaGrid media={media || []} />
        <div className="flex items-center justify-between mt-6">
          {(() => {
            const limitNum = Math.min(Number.parseInt(params.limit || "40"), 200)
            const curr = Number.parseInt(params.page || "1")
            const prev = Math.max(1, curr - 1)
            const next = curr + 1
            return (
              <>
                <a
                  href={`/admin/media?type=${encodeURIComponent(params.type || "")}&category=${encodeURIComponent(
                    params.category || "",
                  )}&search=${encodeURIComponent(params.search || "")}&limit=${limitNum}&page=${prev}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Poprzednia
                </a>
                <a
                  href={`/admin/media?type=${encodeURIComponent(params.type || "")}&category=${encodeURIComponent(
                    params.category || "",
                  )}&search=${encodeURIComponent(params.search || "")}&limit=${limitNum}&page=${next}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Następna
                </a>
              </>
            )
          })()}
        </div>
      </Card>
    </div>
  )
}
