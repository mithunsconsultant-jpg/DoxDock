import Icon from './Icon.jsx'

// Honest, always-visible reassurance. This is the whole reason DoxDock exists.
export default function PrivacyBadge({ compact = false }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:border-green-800/60 dark:bg-green-900/20 dark:text-green-300"
      title="DoxDock makes zero network requests. Everything runs in your browser."
    >
      <Icon name="shieldCheck" className="h-4 w-4" />
      {compact ? (
        <span>100% local</span>
      ) : (
        <span>Runs entirely in your browser — no uploads, no network.</span>
      )}
    </div>
  )
}
