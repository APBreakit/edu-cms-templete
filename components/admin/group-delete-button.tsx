"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteGroup } from "@/app/actions/admin-actions"
import { toast } from "sonner"

export default function GroupDeleteButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć tę grupę?")) return
    setLoading(true)
    const res = await deleteGroup(slug)
    setLoading(false)
    if (res?.success) {
      toast.success("Grupa usunięta")
      window.location.reload()
    } else {
      toast.error(res?.error || "Błąd podczas usuwania grupy")
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={onDelete} disabled={loading}>
      Usuń
    </Button>
  )
}

