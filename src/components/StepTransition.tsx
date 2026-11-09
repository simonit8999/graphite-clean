import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  stepKey: number | string
  children: ReactNode
}

/**
 * CROSSFADE between wizard steps (1 ↔ 2 ↔ 3 ↔ 4).
 *
 * These transitions happen INSIDE the wizard curtain, which is already
 * an opaque `bg-ink` surface at z-50. A fade between two inner steps
 * never exposes the hero underneath (both steps have their own ink
 * background from the parent overlay), so opacity is safe here.
 *
 * For maximum robustness we use `mode="popLayout"` so the outgoing step
 * stays painted (removed from layout flow) while the incoming step
 * fades on top of it — no gap, no flash between wizard steps.
 *
 * The hero ↔ wizard handover is handled by the sliding curtain in
 * App.tsx, NOT by this component.
 */
export default function StepTransition({ stepKey, children }: Props) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 w-full h-full flex flex-col bg-ink"
        style={{ willChange: 'opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}