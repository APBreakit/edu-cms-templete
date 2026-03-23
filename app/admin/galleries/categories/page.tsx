 

import { getGalleryCategories, createGalleryCategory } from "@/app/actions/admin-actions"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const dynamic = "force-dynamic"

export default async function GalleryCategoriesPage() {
  const categories = await getGalleryCategories()

  async function add(formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    const visible = formData.get("visible") === "on"
    const order = Number(formData.get("order") || 0)
    if (!name) return
    await createGalleryCategory({ name, visible, display_order: order })
  }

  

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl space-y-8">
        <h1 className="text-2xl font-bold">Kategorie Galerii</h1>

        <section className="space-y-4">
          <form action={add} className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="name" className="block text-sm font-medium">Nazwa</label>
              <input id="name" name="name" className="w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label htmlFor="order" className="block text-sm font-medium">Kolejność</label>
              <input id="order" name="order" type="number" className="w-24 border px-3 py-2 rounded" defaultValue={0} />
            </div>
            <div className="flex items-center gap-2">
              <input id="visible" name="visible" type="checkbox" defaultChecked />
              <label htmlFor="visible" className="text-sm">Widoczna</label>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded">Dodaj</button>
          </form>
        </section>

        <section className="space-y-3">
          {categories?.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between border rounded px-3 py-2">
              <div className="flex-1">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">slug: {c.slug} • kolejność: {c.display_order ?? 0}</div>
              </div>
              <div>
                <span className={`px-2 py-1 rounded text-xs ${c.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.visible ? 'Widoczna' : 'Ukryta'}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </main>
  )
}
