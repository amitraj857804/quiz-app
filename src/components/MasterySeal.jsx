import { motion } from 'framer-motion'

/**
 * MasterySeal — the app's signature element.
 * A hand-stamped circular seal (like an exam grader's stamp) whose ring
 * fills to represent score / topic mastery. Deliberately slightly
 * imperfect (rotated notch, uneven dash) rather than a clean progress ring.
 */
export default function MasterySeal({ percent = 0, size = 160, label, passed }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference
  const ringColor = passed ? 'var(--color-gold)' : 'var(--color-paper-dim)'

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-ink-700)"
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* small notch to break the ring's perfection, like a wax-seal edge */}
        <circle
          cx={size / 2 + radius}
          cy={size / 2}
          r={2.5}
          fill="var(--color-ink-950)"
          transform={`rotate(20 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl text-paper tabular-nums">{Math.round(percent)}%</span>
        {label && <span className="mt-1 text-[11px] uppercase tracking-widest text-paper-dim">{label}</span>}
      </div>
    </div>
  )
}
