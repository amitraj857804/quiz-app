const variants = {
  primary:
    'bg-gold text-ink-950 hover:bg-gold-dim focus-visible:ring-gold',
  secondary:
    'bg-transparent border border-line text-paper hover:border-paper-dim focus-visible:ring-paper-dim',
  ghost:
    'bg-transparent text-paper-dim hover:text-paper focus-visible:ring-paper-dim',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-body text-sm font-medium tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
