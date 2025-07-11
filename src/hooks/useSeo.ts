import { useEffect } from 'react'

interface UseSeoOptions {
  title?: string
  description?: string
}

export function useSeo({ title, description }: UseSeoOptions) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }
  }, [title, description])
} 