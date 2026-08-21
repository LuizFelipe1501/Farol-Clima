import { Flame } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-[var(--color-bg-surface)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
            <Flame size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Farol Clima</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Painel ClimaBrasil · Governança climática de estados e capitais
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-3 py-1 rounded-full">
            ClimatonBrasil 2026
          </span>
        </div>
      </div>
    </header>
  )
}
