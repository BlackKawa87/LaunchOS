interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  warning?: boolean
}

export default function MetricCard({ label, value, sub, accent, warning }: MetricCardProps) {
  const valueColor = accent ? 'var(--c-accent)' : warning ? 'var(--c-amber)' : 'var(--c-text)'

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
        {label}
      </p>
      <p className="text-3xl font-semibold leading-none mb-1" style={{ color: valueColor, fontFamily: '"DM Mono", monospace' }}>
        {value}
      </p>
      {sub && (
        <p className="text-[12px] mt-2 truncate" style={{ color: 'var(--c-muted)' }}>{sub}</p>
      )}
    </div>
  )
}
