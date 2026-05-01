interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  warning?: boolean
}

export default function MetricCard({ label, value, sub, accent, warning }: MetricCardProps) {
  const valueColor = accent ? '#00d084' : warning ? '#f59e0b' : '#e8e8e8'

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ background: '#111111', borderColor: '#2a2a2a' }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
        {label}
      </p>
      <p className="text-3xl font-semibold leading-none mb-1" style={{ color: valueColor, fontFamily: '"DM Mono", monospace' }}>
        {value}
      </p>
      {sub && (
        <p className="text-[12px] mt-2 truncate" style={{ color: '#555' }}>{sub}</p>
      )}
    </div>
  )
}
