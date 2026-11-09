import { motion } from 'framer-motion'

interface Props {
  step: number // 1..4
  total?: number
}

export default function ProgressBar({ step, total = 4 }: Props) {
  return (
    <div className="px-5 pt-4 pb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-zincsoft font-medium">
          Шаг {step} из {total}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-accent font-semibold">
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent shadow-glow"
          initial={false}
          animate={{ width: `${(step / total) * 100}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        />
      </div>
    </div>
  )
}