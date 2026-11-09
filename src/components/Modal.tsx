import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  message: string
}

export default function Modal({ open, onClose, title, message }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative w-full max-w-md rounded-3xl bg-surface/95 border border-white/10 p-6 safe-bottom"
          >
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
            <p className="text-zincsoft text-sm leading-relaxed">{message}</p>
            <button
              onClick={onClose}
              className="mt-6 w-full h-12 rounded-full bg-accent text-white font-semibold text-sm shadow-glow"
            >
              Понятно
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}