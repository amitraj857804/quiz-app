export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-sm border border-line bg-ink-900 p-6 ${className}`}
    >
      {children}
    </div>
  )
}
