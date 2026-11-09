import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Car, Hash, User, MessageSquare, Phone } from 'lucide-react'
import type { BookingData } from '../types'

interface Props {
  data: BookingData
  onChange: (patch: Partial<BookingData>) => void
  onNext: () => void
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

/**
 * Russian phone mask: +7 (XXX) XXX-XX-XX
 */
function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')

  // Strip the country prefix (7 or 8) if present
  if (digits.startsWith('7')) digits = digits.slice(1)
  else if (digits.startsWith('8')) digits = digits.slice(1)

  digits = digits.slice(0, 10)

  if (digits.length === 0) return '+7 ('

  const p1 = digits.slice(0, 3)
  const p2 = digits.slice(3, 6)
  const p3 = digits.slice(6, 8)
  const p4 = digits.slice(8, 10)

  let out = '+7 (' + p1
  if (digits.length >= 3) out += ')'
  if (p2) out += ' ' + p2
  if (p3) out += '-' + p3
  if (p4) out += '-' + p4

  return out
}

export default function Screen3Details({ data, onChange, onNext }: Props) {
  const [phoneDisplay, setPhoneDisplay] = useState<string>(
    data.phone ? formatPhone(data.phone) : '+7 ('
  )
  const phoneRef = useRef<HTMLInputElement>(null)

  // Sync display if parent resets data.phone to empty
  useEffect(() => {
    if (!data.phone) setPhoneDisplay('+7 (')
  }, [data.phone])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = formatPhone(e.target.value)
    setPhoneDisplay(next)
    // Store as +7XXXXXXXXXX so it's always 11 digits when complete.
    const digitsOnly = next.replace(/\D/g, '').replace(/^7/, '')
    onChange({ phone: digitsOnly ? `+7${digitsOnly}` : '' })
  }

  const handlePhoneFocus = () => {
    const el = phoneRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.setSelectionRange(el.value.length, el.value.length)
    })
  }

  /*
   * VALIDATION — derived from `data` (the parent-owned booking state),
   * which is always in sync after the user's keystroke commits.
   *
   * `data.phone` is stored as `+7XXXXXXXXXX`, so stripping non-digits
   * gives 11 chars for a complete RU number. We use `>= 11` to be safe
   * against paste/autofill edge cases.
   *
   * Plate and comment are optional and never affect validity.
   */
  const phoneDigits = data.phone.replace(/\D/g, '')
  const valid =
    data.name.trim().length > 0 &&
    data.carModel.trim().length > 0 &&
    phoneDigits.length >= 11

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* SCROLLABLE FORM AREA */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="pt-2 pb-5">
          <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">
            Детали вашего авто
          </h1>
          <p className="mt-1.5 text-zincsoft text-sm">Так мы подготовимся к вашему визиту</p>
        </div>

        <motion.form
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3.5"
          onSubmit={(e) => { e.preventDefault(); if (valid) onNext() }}
        >
          {/* 1. Name */}
          <Field variants={item} icon={<User className="w-4 h-4" />} label="Ваше имя *">
            <input
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Александр"
              className="w-full bg-transparent outline-none text-[15px] placeholder:text-white/25"
            />
          </Field>

          {/* 2. Phone with mask */}
          <Field variants={item} icon={<Phone className="w-4 h-4" />} label="Номер телефона *">
            <input
              ref={phoneRef}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phoneDisplay}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              placeholder="+7 (___) ___-__-__"
              className="w-full bg-transparent outline-none text-[15px] placeholder:text-white/25 tabular-nums"
            />
          </Field>

          {/* 3. Car model */}
          <Field variants={item} icon={<Car className="w-4 h-4" />} label="Марка и модель *">
            <input
              value={data.carModel}
              onChange={(e) => onChange({ carModel: e.target.value })}
              placeholder="BMW M5"
              className="w-full bg-transparent outline-none text-[15px] placeholder:text-white/25"
            />
          </Field>

          {/* 4. Plate (optional) */}
          <Field variants={item} icon={<Hash className="w-4 h-4" />} label="Номер авто (опционально)">
            <input
              value={data.plate}
              onChange={(e) => onChange({ plate: e.target.value })}
              placeholder="А123ВС 77"
              className="w-full bg-transparent outline-none text-[15px] uppercase placeholder:text-white/25"
            />
          </Field>

          {/* 5. Comment (optional) */}
          <motion.div variants={item} className="rounded-2xl bg-surface/60 border border-white/10 p-4 glow-focus transition-shadow">
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-[0.16em] text-zincsoft font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              Комментарий (опционально)
            </div>
            <textarea
              value={data.comment}
              onChange={(e) => onChange({ comment: e.target.value })}
              placeholder="Царапина на двери, нужна химчистка"
              rows={3}
              className="w-full bg-transparent outline-none text-[15px] resize-none placeholder:text-white/25"
            />
          </motion.div>
        </motion.form>
      </div>

      {/* FIXED FOOTER — always visible, background prevents content bleed-through */}
      <div className="shrink-0 px-5 pt-3 pb-6 bg-ink/95 backdrop-blur-xl border-t border-white/5 safe-bottom">
        <motion.button
          whileTap={{ scale: valid ? 0.96 : 1 }}
          disabled={!valid}
          onClick={onNext}
          className={`w-full h-14 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${
            valid
              ? 'bg-accent text-white shadow-glow'
              : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
          }`}
        >
          Выбрать время
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}

function Field({
  children, icon, label, variants,
}: {
  children: React.ReactNode; icon: React.ReactNode; label: string; variants: any
}) {
  return (
    <motion.label
      variants={variants}
      className="rounded-2xl bg-surface/60 border border-white/10 p-4 glow-focus transition-shadow block"
    >
      <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-[0.16em] text-zincsoft font-medium">
        {icon}
        {label}
      </div>
      {children}
    </motion.label>
  )
}