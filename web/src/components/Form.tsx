'use client'

import { Camera } from 'lucide-react'
import { MediaPicker } from './MediaPicker'
import { FormEvent } from 'react'
import Cookie from 'js-cookie'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export function Form() {
  const router = useRouter()

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('file')

    let coverUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()

      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    }

    const token = Cookie.get('token')

    await api.post(
      '/memories',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="file"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 transition-colors hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar ficheiro
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 transition-colors hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h4 w-4 rounded border-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>
      <MediaPicker />

      <textarea
        name="content"
        id="content"
        spellCheck={false}
        className="text-large w-full flex-1 resize-none rounded border-0 bg-transparent p-0 leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />

      <button
        className="text-xm inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt uppercase leading-none text-black transition-colors hover:bg-green-600"
        type="submit"
      >
        Guardar
      </button>
    </form>
  )
}
