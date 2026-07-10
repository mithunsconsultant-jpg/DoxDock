import Icon from './Icon.jsx'

// Compact navbar badge announcing OSCode Community support, with a periodic
// "shine" sweep. Logo is served locally (public/oscode.png) to respect the CSP.
export default function OSCodeNavBadge() {
  return (
    <a
      href="https://github.com/OSCode-Community"
      target="_blank"
      rel="noopener noreferrer"
      title="DoxDock is supported by OSCode Community"
      className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-[#00C9FF]/40 bg-[#00C9FF]/10 px-2.5 py-1 text-xs font-medium text-[#0e7490] transition-colors hover:bg-[#00C9FF]/20 dark:text-[#7fe9ff]"
    >
      <img src="/oscode.png" alt="" className="h-4 w-4 flex-shrink-0 rounded-sm" />
      <span className="hidden whitespace-nowrap sm:inline">Supported by OSCode</span>
      <Icon name="sparkles" className="h-3.5 w-3.5 flex-shrink-0 animate-pulse text-[#00C9FF]" />
      <span
        aria-hidden="true"
        className="oscode-shine pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-transparent via-white/55 to-transparent"
      />
    </a>
  )
}
