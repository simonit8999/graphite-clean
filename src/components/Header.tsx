import { ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  onBack: () => void
}

export default function Header({ title, onBack }: Props) {
  return (
    <header className="safe-top sticky top-0 z-30">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 bg-ink/80 backdrop-blur-xl border-b border-white/[0.06]">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          aria-label="Назад"
          className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />
        </motion.button>
        <h2 className="font-display font-bold text-[15px] tracking-tight text-white/90 uppercase">
          {title}
        </h2>
      </div>
    </header>
  )
}