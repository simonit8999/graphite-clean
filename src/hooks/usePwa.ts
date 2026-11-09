import { useEffect } from 'react'

export function usePwaTheme(color: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', color)
  }, [color])
}