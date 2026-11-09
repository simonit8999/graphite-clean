import { useEffect, useState } from 'react'
import type { AppConfig } from '../types'

// Import the images through Vite so they get hashed, optimized and bundled.
// We override config paths with these imported URLs so the app works the
// same in dev and in production (GitHub Pages sub-path, etc.).
import heroImg from '../assets/hero.jpg'
import service1Img from '../assets/service1.jpg'
import service2Img from '../assets/service2.jpg'
import service3Img from '../assets/service3.jpg'

const serviceImageByIndex = [service1Img, service2Img, service3Img]

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.BASE_URL}config.json`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<AppConfig>
      })
      .then((data: AppConfig) => {
        if (cancelled) return

        // Inject accent color as CSS variable
        const rgb = hexToRgb(data.accent_color)
        if (rgb) {
          document.documentElement.style.setProperty('--accent', `${rgb.r} ${rgb.g} ${rgb.b}`)
        }

        // Force-patch every image path with the Vite-imported URL.
        // The hidden preloader in App.tsx references these same URLs, so
        // Chrome keeps the decoded texture alive for the whole session.
        const patched: AppConfig = {
          ...data,
          hero_image: heroImg,
          services: data.services.map((s, i) => ({
            ...s,
            image: serviceImageByIndex[i] ?? s.image,
          })),
        }

        setConfig(patched)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { config, error }
}

function hexToRgb(hex: string) {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}