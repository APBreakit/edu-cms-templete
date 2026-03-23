import { getPostById } from "@/lib/db/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"

export default async function ViewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await getPostById(id)

  if (!post) {
    redirect("/admin/posts")
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "aktualnosci":
        return "Aktualność"
      case "ogloszenia":
        return "Ogłoszenie"
      case "konkursy":
        return "Konkurs"
      case "rada-rodzicow":
        return "Rada Rodziców"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">Opublikowany</span>
        )
      case "draft":
        return <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">Szkic</span>
      case "archived":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-full">Zarchiwizowany</span>
        )
      default:
        return status
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do listy
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/posts/${id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edytuj
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{getTypeLabel(post.type)}</span>
                <span className="text-gray-300">•</span>
                {getStatusBadge(post.status || 'draft')}
                {post.add_to_calendar && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-sm text-blue-600">
                      <Calendar className="w-4 h-4" />W kalendarzu
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {post.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {post.excerpt && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-medium">{post.excerpt}</p>
            </div>
          )}

          <div className="prose max-w-none">
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>

          {post.type === "konkursy" && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informacje o konkursie</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {post.competition_status && (
                  <div>
                    <span className="text-sm text-gray-600">Status konkursu:</span>
                    <p className="font-medium">
                      {post.competition_status === "upcoming"
                        ? "Nadchodzący"
                        : post.competition_status === "ongoing"
                          ? "Trwa"
                          : "Zakończony"}
                    </p>
                  </div>
                )}
                {post.competition_start_date && (
                  <div>
                    <span className="text-sm text-gray-600">Data rozpoczęcia:</span>
                    <p className="font-medium">{new Date(post.competition_start_date).toLocaleString("pl-PL")}</p>
                  </div>
                )}
                {post.competition_end_date && (
                  <div>
                    <span className="text-sm text-gray-600">Data zakończenia:</span>
                    <p className="font-medium">{new Date(post.competition_end_date).toLocaleString("pl-PL")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {post.add_to_calendar && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Kalendarz</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {post.calendar_date && (
                  <div>
                    <span className="text-sm text-gray-600">Data wydarzenia:</span>
                    <p className="font-medium">{new Date(post.calendar_date).toLocaleString("pl-PL")}</p>
                  </div>
                )}
                {post.calendar_end_date && (
                  <div>
                    <span className="text-sm text-gray-600">Data zakończenia:</span>
                    <p className="font-medium">{new Date(post.calendar_end_date).toLocaleString("pl-PL")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-6 text-sm text-gray-600">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span>Data utworzenia:</span>
                <p className="font-medium text-gray-900">{new Date(post.created_at).toLocaleString("pl-PL")}</p>
              </div>
              {post.published_at && (
                <div>
                  <span>Data publikacji:</span>
                  <p className="font-medium text-gray-900">{new Date(post.published_at).toLocaleString("pl-PL")}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
