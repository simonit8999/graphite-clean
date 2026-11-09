import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Phone, Send, MapPin } from 'lucide-react'
import type { AppConfig } from '../types'

interface Props {
  config: AppConfig
  onStart: () => void
}

/**
 * Motion variants for the hero content. The parent orchestrates the
 * cascade; children just declare hidden / visible states. The staggered
 * reveal only starts once the Bugatti is decoded (imgReady).
 */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Screen1Hero({ config, onStart }: Props) {
  const [imgReady, setImgReady] = useState(false)
  const startedRef = useRef(false)

  /**
   * PRESERVED FIX: image can disappear ~1s after mount if it decodes
   * while an ancestor opacity animation is running. Waiting for
   * `img.decode()` guarantees the bitmap is paint-ready before we
   * animate anything on top of it.
   */
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const probe = new Image()
    probe.decoding = 'async'
    probe.src = config.hero_image

    const finish = () => setImgReady(true)

    if (typeof probe.decode === 'function') {
      probe.decode().then(finish).catch(finish)
    } else if (probe.complete) {
      finish()
    } else {
      probe.onload = finish
      probe.onerror = finish
    }

    const timeout = window.setTimeout(finish, 2500)
    return () => window.clearTimeout(timeout)
  }, [config.hero_image])

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: '100dvh', backgroundColor: '#050505' }}
    >
      {/* IMAGE LAYER — plain, opaque, z-0 */}
      <motion.img
        src={config.hero_image}
        alt={config.business_name}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{ zIndex: 0 }}
        draggable={false}
        decoding="async"
        fetchPriority="high"
        initial={{ opacity: 0 }}
        animate={{ opacity: imgReady ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Gradient overlays — separate siblings above the image, z-10 */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-transparent pointer-events-none"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      />

      {/* CONTENT LAYER — staggered reveal once the image is decoded */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={imgReady ? 'visible' : 'hidden'}
        className="relative flex flex-col justify-end px-6 pb-8 safe-bottom"
        style={{ minHeight: '100dvh', zIndex: 20 }}
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-auto pt-8 safe-top">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center font-display font-black text-lg shadow-glow">
              G
            </div>
            <div>
              <div className="font-display font-extrabold tracking-[0.18em] text-sm uppercase">
                {config.logo_text}
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-zincsoft">
                Detailing Studio
              </div>
            </div>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display font-black text-[34px] leading-[1.05] tracking-tight uppercase"
        >
          {config.hero_title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-3 text-zincsoft text-[15px] leading-relaxed max-w-sm"
        >
          {config.hero_subtitle}
        </motion.p>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="mt-8 group relative w-full h-14 rounded-full bg-accent text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-glow active:shadow-glowlg transition-shadow"
        >
          <span>Записаться</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
        </motion.button>

        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-col items-center gap-2.5 text-[12px] text-zincsoft"
        >
          <div className="flex items-center justify-center gap-4">
            <a
              href={`tel:${config.phone.replace(/[^+\d]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {config.phone}
            </a>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a
              href={`https://t.me/${config.telegram_username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Telegram
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {config.address}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}