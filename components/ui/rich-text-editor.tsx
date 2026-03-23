"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CharacterCount from '@tiptap/extension-character-count'
import { Placeholder } from '@tiptap/extension-placeholder'
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Youtube as YoutubeIcon,
    Image as ImageIcon,
    Table as TableIcon,
    PlusSquare,
    MinusSquare,
    Trash2
} from 'lucide-react'
import { MediaPicker } from '@/components/admin/media-picker'
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { createMedia } from "@/app/actions/admin-actions"
import { toast } from "sonner"

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }

    const addYoutubeVideo = () => {
        const url = window.prompt('Wprowadź URL filmu z YouTube')

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            })
        }
    }

    return (
        <div className="flex flex-wrap gap-1 border border-b-0 border-gray-300 rounded-t-lg bg-gray-50 p-2 sticky top-0 z-10 shadow-sm transition-all">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Pogrubienie"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Kursywa"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded transition-colors ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Podkreślenie"
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-2 rounded transition-colors ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Przekreślenie"
            >
                <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 my-auto mx-1"></div>

            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Wyrównaj do lewej"
            >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Wyrównaj do środka"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Wyrównaj do prawej"
            >
                <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 my-auto mx-1"></div>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Nagłówek 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Nagłówek 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Nagłówek 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 my-auto mx-1"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Lista punktowa"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Lista numerowana"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Cytat"
            >
                <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 my-auto mx-1"></div>

            <button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className="p-2 rounded hover:bg-gray-200"
                type="button"
                title="Wstaw tabelę"
            >
                <TableIcon className="w-4 h-4" />
            </button>

            {editor.isActive('table') && (
                <>
                    <button
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        className="p-2 rounded hover:bg-gray-200 text-green-600"
                        type="button"
                        title="Dodaj kolumnę"
                    >
                        <PlusSquare className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        className="p-2 rounded hover:bg-gray-200 text-red-600"
                        type="button"
                        title="Usuń kolumnę"
                    >
                        <MinusSquare className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="p-2 rounded hover:bg-gray-200 text-red-700"
                        type="button"
                        title="Usuń tabelę"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </>
            )}

            <div className="w-px h-6 bg-gray-300 my-auto mx-1"></div>

            <MediaPicker
                onSelect={(url) => editor.chain().focus().setImage({ src: url }).run()}
                trigger={
                    <button
                        className="p-2 rounded hover:bg-gray-200"
                        type="button"
                        title="Wstaw obraz"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                }
            />

            <button
                onClick={addYoutubeVideo}
                className="p-2 rounded hover:bg-gray-200"
                type="button"
                title="Wstaw wideo YouTube"
            >
                <YoutubeIcon className="w-4 h-4" />
            </button>

            <button
                onClick={() => {
                    const previousUrl = editor.getAttributes('link').href
                    const url = window.prompt('Wprowadź adres URL', previousUrl)

                    if (url === null) {
                        return
                    }

                    if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run()
                        return
                    }

                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                }}
                className={`p-2 rounded transition-colors ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
                type="button"
                title="Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 my-auto mx-1"></div>

            <input
                type="color"
                onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-8 h-8 p-1 rounded cursor-pointer mt-0.5 border border-gray-200"
                title="Kolor tekstu"
            />

            <div className="flex-1"></div>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                type="button"
                title="Cofnij"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                type="button"
                title="Ponów"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    )
}

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const handleImageUpload = async (file: File) => {
        const toastId = toast.loading("Wgrywanie zdjęcia...")
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

            await createMedia({
                file_name: file.name,
                file_url: data.url,
                file_type: "image",
                category: "post",
                uploaded_by: "drag-drop",
            })

            toast.success("Zdjęcie dodane", { id: toastId })
            return data.url
        } catch (err) {
            console.error(err)
            toast.error("Błąd podczas wgrywania", { id: toastId })
            return null
        }
    }

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-h-[500px] object-contain mx-auto shadow-md my-4',
                },
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: 'aspect-video w-full rounded-lg my-6 shadow-lg',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            CharacterCount,
            Placeholder.configure({
                placeholder: placeholder || 'Zacznij pisać tutaj...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[350px] border border-gray-300 rounded-b-lg p-6 max-w-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0]
                    if (file.type.startsWith('image/')) {
                        handleImageUpload(file).then(url => {
                            if (url) {
                                const { schema } = view.state
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                                const node = schema.nodes.image.create({ src: url })
                                const transaction = view.state.tr.insert(coordinates?.pos || 0, node)
                                view.dispatch(transaction)
                            }
                        })
                        return true
                    }
                }
                return false
            },
            handlePaste: (view, event) => {
                if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
                    const file = event.clipboardData.files[0]
                    if (file.type.startsWith('image/')) {
                        handleImageUpload(file).then(url => {
                            if (url) {
                                const { schema } = view.state
                                const node = schema.nodes.image.create({ src: url })
                                const transaction = view.state.tr.replaceSelectionWith(node)
                                view.dispatch(transaction)
                            }
                        })
                        return true
                    }
                }
                return false
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    return (
        <div className="w-full relative group">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            {editor && (
                <div className="absolute bottom-2 right-4 flex gap-4 text-[10px] uppercase tracking-wider font-bold text-gray-400 pointer-events-none group-hover:opacity-100 transition-opacity">
                    <span>{editor.storage.characterCount.words()} słów</span>
                    <span>{editor.storage.characterCount.characters()} znaków</span>
                </div>
            )}
        </div>
    )
}
