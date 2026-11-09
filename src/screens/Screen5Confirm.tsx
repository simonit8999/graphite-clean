import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import type { AppConfig, BookingData } from '../types'

interface Props {
  config: AppConfig
  data: BookingData
}

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

function fmtDateLong(d: string | null) {
  if (!d) return '—'
  const dt = new Date(d)
  const wd = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][dt.getDay()]
  return `${wd}, ${dt.getDate()} ${MONTHS[dt.getMonth()]}`
}

export default function Screen5Confirm({ config, data }: Props) {
  const total = data.service?.price ?? 0

  const handleSend = () => {
    if (!data.service) return
    const lines = [
      `🚗 Новая заявка — ${config.business_name}`,
      ``,
      `Услуга: ${data.service.name}`,
      `Авто: ${data.carModel}${data.plate ? ` (${data.plate})` : ''}`,
      `Дата: ${fmtDateLong(data.date)}`,
      `Время: ${data.time}`,
      `Имя: ${data.name}`,
      `Телефон: ${data.phone}`,
      data.comment ? `Комментарий: ${data.comment}` : '',
      ``,
      `Итого: ${fmt(total)}`,
    ].filter(Boolean).join('\n')

    const url = `https://t.me/${config.telegram_username}?text=${encodeURIComponent(lines)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex-1 flex flex-col px-5 pb-6">
      <div className="pt-2 pb-5">
        <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">
          Всё верно?
        </h1>
        <p className="mt-1.5 text-zincsoft text-sm">Проверьте детали перед отправкой</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative rounded-3xl p-6 border border-white/10 bg-glass backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-accent font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Ваша заявка
          </div>

          <Row label="Услуга" value={data.service?.name ?? '—'} />
          <Row label="Авто" value={`${data.carModel}${data.plate ? ` · ${data.plate}` : ''}`} />
          <Row label="Дата" value={fmtDateLong(data.date)} />
          <Row label="Время" value={data.time ?? '—'} />
          <Row label="Имя" value={data.name || '—'} />
          <Row label="Телефон" value={data.phone || '—'} />
          {data.comment && <Row label="Комментарий" value={data.comment} />}

          <div className="mt-5 pt-5 border-t border-white/10">
            <div className="text-[11px] uppercase tracking-[0.18em] text-zincsoft font-medium mb-1">
              Итого
            </div>
            <div className="font-display font-black text-4xl tracking-tight">
              {fmt(total)}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-auto pt-6">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSend}
          className="w-full h-14 rounded-full bg-accent text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-glow active:shadow-glowlg transition-shadow"
        >
          <Send className="w-4 h-4" strokeWidth={2.4} />
          Отправить заявку в Telegram
        </motion.button>
        <p className="mt-3 text-center text-[11px] text-zincsoft leading-relaxed">
          Нажимая кнопку, вы перейдёте в Telegram для отправки заявки
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-zincsoft font-medium">
        {label}
      </div>
      <div className="mt-0.5 text-[15px] font-medium text-white leading-snug">
        {value}
      </div>
    </div>
  )
}