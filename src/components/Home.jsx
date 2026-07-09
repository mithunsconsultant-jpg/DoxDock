import Icon from './Icon.jsx'
import PrivacyBadge from './PrivacyBadge.jsx'
import { groupedOperations, operations } from '../registry/registry.js'

// Landing page shown on first load. Presents every tool as a clickable card,
// grouped by category. Picking a card (or any sidebar entry) opens that tool.
export default function Home({ onSelect, onOpenPalette }) {
  const groups = groupedOperations()

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="pt-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
          Provably local · {operations.length} tools
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Your document toolkit that never phones home.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Convert, edit, compress, and clean up PDFs and images — all running entirely in your
          browser. Nothing you open is ever uploaded. Pick a tool to get started.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <PrivacyBadge />
          <button type="button" onClick={onOpenPalette} className="btn-secondary">
            <Icon name="search" className="h-4 w-4" />
            Search tools
            <kbd className="ml-1 rounded border border-slate-300 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600">
              ⌘K
            </kbd>
          </button>
          <a href="ideology.html" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Icon name="shieldCheck" className="h-4 w-4 text-brand-500" />
            Why it's private
          </a>
        </div>
      </section>

      {/* Tool groups */}
      {groups.map((group) => (
        <section key={group.id}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Icon name={group.icon} className="h-4 w-4" />
            {group.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.ops.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => onSelect(op.id)}
                className="card group flex items-start gap-3 p-4 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/50 dark:hover:border-brand-500/50 dark:hover:bg-brand-900/10"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300">
                  <Icon name={op.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-slate-800 dark:text-slate-100">{op.name}</span>
                  <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{op.description}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
