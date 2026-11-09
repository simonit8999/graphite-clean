import { motion } from 'framer-motion'
import { Clock, Check, ArrowRight } from 'lucide-react'
import type { AppConfig, Service } from '../types'

interface Props {
  config: AppConfig
  selected: Service | null
  onSelect: (s: Service) => void
  onNext: () => void
}

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Screen2Service({ config, selected, onSelect, onNext }: Props) {
  return (
    <div className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
      <div className="pt-2 pb-5">
        <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">
          Выберите услугу
        </h1>
        <p className="mt-1.5 text-zincsoft text-sm">Всё, что нужно вашему авто — в одном месте</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3.5"
      >
        {config.services.map((s) => {
          const active = selected?.id === s.id
          return (
            <motion.button
              key={s.id}
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(s)}
              className={`relative overflow-hidden rounded-2xl border text-left transition-colors duration-200 ${
                active
                  ? 'border-accent shadow-glow'
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{ minHeight: 140 }}
            >
              {/*
               * FIX: plain <img> for the background — the invisible preloader
               * in App.tsx keeps this same URL cached so Chrome doesn't evict
               * the texture when the previous screen unmounts.
               */}
              <div className="absolute inset-0 -z-10">
                <img
                  src={s.image}
                  alt=""
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />
              </div>

              {/* Content */}
              <div className="relative p-5 min-h-[140px] flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-xl uppercase tracking-tight leading-tight">
                    {s.name}
                  </h3>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      active ? 'bg-accent shadow-glow' : 'bg-white/10 border border-white/15'
                    }`}
                  >
                    {active && <Check className="w-4 h-4" strokeWidth={3} />}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-6">
                  <div className="flex items-center gap-1.5 text-[12px] text-zincsoft">
                    <Clock className="w-3.5 h-3.5" />
                    {s.duration}
                  </div>
                  <div className="font-display font-extrabold text-2xl tracking-tight text-white">
                    {fmt(s.price)}
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-auto pt-6">
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!selected}
          onClick={onNext}
          className={`w-full h-14 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${
            selected
              ? 'bg-accent text-white shadow-glow'
              : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
          }`}
        >
          Далее
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}