"use client"

import { useState, useEffect, useRef } from "react"
import { getMediaList, createMedia } from "@/app/actions/admin-actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Loader2, Search, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { toast } from "sonner"
import Image from "next/image"

interface MediaPickerProps {
    onSelect: (url: string) => void
    trigger?: React.ReactNode
}

export function MediaPicker({ onSelect, trigger }: MediaPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [media, setMedia] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchMedia = async () => {
        setLoading(true)
        const result = await getMediaList()
        if (result.success) {
            setMedia(result.data || [])
        }
        setLoading(false)
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const optimized = await optimizeImage(file, 1920, 0.85)
            const formData = new FormData()
            formData.append("file", optimized)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Upload failed")
            const data = await response.json()

            // Create record in DB
            await createMedia({
                file_name: file.name,
                file_url: data.url,
                file_type: "image",
                category: "post",
                uploaded_by: "editor",
            })

            onSelect(data.url)
            setIsOpen(false)
            toast.success("Zdjęcie wgrane i wybrane")
        } catch (err) {
            console.error(err)
            toast.error("Błąd podczas wgrywania")
        } finally {
            setUploading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchMedia()
        }
    }, [isOpen])

    const filteredMedia = media.filter(
        (item) =>
            item.file_type === "image" &&
            (item.file_name?.toLowerCase().includes(search.toLowerCase()) || false)
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Wybierz z biblioteki
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <DialogTitle>Biblioteka mediów</DialogTitle>
                    <div className="flex items-center gap-2 pr-6">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        <Button
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            Wgraj nowe
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Szukaj obrazu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchMedia} disabled={loading}>
                        <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Brak obrazów spełniających kryteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {filteredMedia.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer transition-all"
                                    onClick={() => {
                                        onSelect(item.file_url)
                                        setIsOpen(false)
                                    }}
                                >
                                    <img
                                        src={item.file_url}
                                        alt={item.file_name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs p-2 text-center break-words">
                                        {item.file_name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
