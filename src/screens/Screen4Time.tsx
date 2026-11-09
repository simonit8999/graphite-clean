import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays } from 'lucide-react'
import type { AppConfig } from '../types'

interface Props {
  config: AppConfig
  date: string | null
  time: string | null
  onDate: (d: string) => void
  onTime: (t: string) => void
  onNext: () => void
}

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

function fmtDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export default function Screen4Time({ config, date, time, onDate, onTime, onNext }: Props) {
  const days = useMemo(() => {
    const arr: Date[] = []
    const now = new Date()
    for (let i = 0; i < 14; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [])

  const slots = useMemo(() => {
    const [sh, sm] = config.working_hours.start.split(':').map(Number)
    const [eh, em] = config.working_hours.end.split(':').map(Number)
    const step = config.working_hours.slot_minutes ?? 90
    const startMin = sh * 60 + sm
    const endMin = eh * 60 + em
    const out: string[] = []
    for (let m = startMin; m + step <= endMin; m += step) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0')
      const mm = String(m % 60).padStart(2, '0')
      out.push(`${hh}:${mm}`)
    }
    return out
  }, [config])

  return (
    <div className="flex-1 flex flex-col px-5 pb-6">
      <div className="pt-2 pb-5">
        <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">
          Когда вам удобно?
        </h1>
        <p className="mt-1.5 text-zincsoft text-sm">Выберите день и время визита</p>
      </div>

      {/* Calendar */}
      <div className="flex items-center gap-2 mb-3 text-[11px] uppercase tracking-[0.16em] text-zincsoft font-medium">
        <CalendarDays className="w-3.5 h-3.5" /> Дата
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {days.map((d, i) => {
          const key = d.toISOString().slice(0, 10)
          const active = date === key
          const today = i === 0
          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.94 }}
              onClick={() => { onDate(key); onTime('') }}
              className={`shrink-0 w-[72px] rounded-2xl border flex flex-col items-center justify-center py-3 transition-all ${
                active
                  ? 'bg-accent border-accent text-white shadow-glow'
                  : 'bg-surface/60 border-white/10 text-white hover:border-white/25'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider ${active ? 'text-white/85' : 'text-zincsoft'}`}>
                {today ? 'Сегодня' : WEEKDAYS[d.getDay()]}
              </span>
              <span className="font-display font-extrabold text-lg leading-tight mt-0.5">
                {d.getDate()}
              </span>
              <span className={`text-[10px] ${active ? 'text-white/85' : 'text-zincsoft'}`}>
                {MONTHS[d.getMonth()]}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Slots */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] uppercase tracking-[0.16em] text-zincsoft font-medium">Время</div>
          {date && <div className="text-[11px] text-zincsoft">{fmtDate(new Date(date))}</div>}
        </div>

        {!date ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-zincsoft">
            Сначала выберите дату
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025 } } }}
            className="grid grid-cols-3 gap-2.5"
          >
            {slots.map((t) => {
              const active = time === t
              return (
                <motion.button
                  key={t}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTime(t)}
                  className={`h-12 rounded-xl text-sm font-semibold border transition-all ${
                    active
                      ? 'bg-accent border-accent text-white shadow-glow'
                      : 'bg-surface/60 border-white/10 text-white hover:border-white/25'
                  }`}
                >
                  {t}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!date || !time}
          onClick={onNext}
          className={`w-full h-14 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${
            date && time
              ? 'bg-accent text-white shadow-glow'
              : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
          }`}
        >
          Продолжить
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}