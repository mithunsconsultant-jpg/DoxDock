import Icon from './Icon.jsx'

const STYLES = {
  info: {
    box: 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-800/60 dark:bg-brand-900/20 dark:text-brand-200',
    icon: 'info',
  },
  warning: {
    box: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-200',
    icon: 'alert',
  },
  error: {
    box: 'border-red-300 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-200',
    icon: 'alert',
  },
}

// Callout used for fidelity caveats (warning), tips (info), and error messages.
export default function Note({ type = 'info', title, children, className = '' }) {
  const s = STYLES[type] || STYLES.info
  return (
    <div className={`flex gap-3 rounded-lg border p-3 text-sm ${s.box} ${className}`} role={type === 'error' ? 'alert' : undefined}>
      <Icon name={s.icon} className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  )
}
