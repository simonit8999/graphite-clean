/// <reference types="vite/client" />

// Explicit declarations in case Vite's client types are ever tree-shaken by
// a stricter tsconfig. These make `import heroImg from '../assets/hero.jpg'`
// and `import icon from '../assets/icon-192.png'` type-safe everywhere.
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.webp' {
  const src: string
  export default src
}
declare module '*.svg' {
  const src: string
  export default src
}