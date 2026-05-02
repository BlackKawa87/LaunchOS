import { useNavigate } from 'react-router-dom'
import { AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { STATUS_LABELS, STATUS_COLORS, TYPE_LABELS, getProjectProgress, formatCurrency } from '../utils/helpers'
import type { ProjectStatus } from '../types'

function roi(revenue = 0, adSpend = 0): number | null {
  if (!adSpend) return null
  return ((revenue - adSpend) / adSpend) * 100
}

function fmt(value: number | undefined, currency = 'USD') {
  if (!value) return <span style={{ color: 'var(--c-muted-2)' }}>—</span>
  return formatCurrency(value, currency)
}

const STATUS_ORDER: ProjectStatus[] = ['ideia', 'desenvolvimento', 'pre-lancamento', 'ativo', 'pausado', 'arquivado']

export default function Operacoes() {
  const { projects } = useApp()
  const navigate = useNavigate()

  const active = projects.filter(p => p.status !== 'arquivado')

  const totalRevenue = projects.reduce((s, p) => s + (p.revenue ?? 0), 0)
  const totalAdSpend = projects.reduce((s, p) => s + (p.adSpend ?? 0), 0)
  const totalProfit = totalRevenue - totalAdSpend
  const overallROI = roi(totalRevenue, totalAdSpend)

  // Pipeline counts
  const pipeline = STATUS_ORDER.map(status => ({
    status,
    count: projects.filter(p => p.status === status).length,
    color: STATUS_COLORS[status],
    label: STATUS_LABELS[status],
  })).filter(s => s.count > 0)

  // Alerts
  const alerts: { type: 'warn' | 'danger'; message: string; projectId: string; projectName: string }[] = []
  for (const p of active) {
    if (p.status === 'ativo' && !p.revenue) {
      alerts.push({ type: 'warn', message: 'Produto ativo sem receita registrada', projectId: p.id, projectName: p.name })
    }
    if (p.targetLaunchDate) {
      const daysLate = Math.ceil((Date.now() - new Date(p.targetLaunchDate).getTime()) / 86400000)
      if (daysLate > 0 && p.status !== 'ativo' && p.status !== 'arquivado') {
        alerts.push({ type: 'danger', message: `Lançamento atrasado há ${daysLate} dia${daysLate !== 1 ? 's' : ''}`, projectId: p.id, projectName: p.name })
      }
    }
    if (p.adSpend && p.revenue !== undefined && p.revenue < p.adSpend) {
      alerts.push({ type: 'danger', message: 'Investimento em tráfego maior que a receita (ROI negativo)', projectId: p.id, projectName: p.name })
    }
  }

  const sorted = [...active].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1" style={{ color: 'var(--c-text)', fontFamily: '"Instrument Serif", serif' }}>
          Operações
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
          Visão consolidada de todos os produtos e resultados financeiros
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Receita Total" value={totalRevenue ? formatCurrency(totalRevenue) : '—'} accent />
        <SummaryCard label="Investimento Total" value={totalAdSpend ? formatCurrency(totalAdSpend) : '—'} />
        <SummaryCard
          label="Lucro Líquido"
          value={totalRevenue || totalAdSpend ? formatCurrency(totalProfit) : '—'}
          accent={totalProfit > 0}
          danger={totalProfit < 0}
        />
        <SummaryCard
          label="ROI Geral"
          value={overallROI !== null ? `${overallROI >= 0 ? '+' : ''}${overallROI.toFixed(0)}%` : '—'}
          accent={overallROI !== null && overallROI > 0}
          danger={overallROI !== null && overallROI < 0}
        />
      </div>

      {/* P&L Table */}
      <section className="mb-8">
        <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--c-text)' }}>
          P&L por Produto
        </h2>

        {active.length === 0 ? (
          <div className="rounded-xl border py-12 text-center" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
            <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>Nenhum produto ativo ainda.</p>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--c-border)' }}>
            {/* Table header */}
            <div
              className="grid text-[11px] font-medium uppercase tracking-wider px-5 py-3 border-b"
              style={{
                gridTemplateColumns: '1fr 120px 100px 100px 100px 80px 90px',
                color: 'var(--c-muted)',
                background: 'var(--c-surface-dim)',
                borderColor: 'var(--c-border)',
                fontFamily: '"DM Mono", monospace',
              }}
            >
              <span>Produto</span>
              <span>Tipo</span>
              <span className="text-right">Receita</span>
              <span className="text-right">Ads</span>
              <span className="text-right">Lucro</span>
              <span className="text-right">ROI</span>
              <span className="text-right">Progresso</span>
            </div>

            {/* Rows */}
            {sorted.map(project => {
              const profit = (project.revenue ?? 0) - (project.adSpend ?? 0)
              const r = roi(project.revenue, project.adSpend)
              const progress = getProjectProgress(project)
              const statusColor = STATUS_COLORS[project.status]

              return (
                <div
                  key={project.id}
                  className="grid items-center px-5 py-3.5 border-b cursor-pointer transition-colors duration-100"
                  style={{
                    gridTemplateColumns: '1fr 120px 100px 100px 100px 80px 90px',
                    borderColor: 'var(--c-border)',
                    background: 'var(--c-surface)',
                    borderLeft: `3px solid ${statusColor}`,
                  }}
                  onClick={() => navigate(`/projeto/${project.id}`)}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-surface)')}
                >
                  {/* Nome + status */}
                  <div className="min-w-0 pr-4">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--c-text)' }}>{project.name}</p>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${statusColor}20`, color: statusColor, fontFamily: '"DM Mono", monospace' }}
                    >
                      {STATUS_LABELS[project.status]}
                    </span>
                  </div>

                  {/* Tipo */}
                  <span className="text-[11px]" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                    {TYPE_LABELS[project.type]}
                  </span>

                  {/* Receita */}
                  <span className="text-[13px] text-right" style={{ color: 'var(--c-text)', fontFamily: '"DM Mono", monospace' }}>
                    {fmt(project.revenue, project.currency)}
                  </span>

                  {/* Ads */}
                  <span className="text-[13px] text-right" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                    {fmt(project.adSpend, project.currency)}
                  </span>

                  {/* Lucro */}
                  <span
                    className="text-[13px] font-medium text-right"
                    style={{
                      color: project.revenue || project.adSpend
                        ? profit >= 0 ? 'var(--c-accent)' : 'var(--c-danger)'
                        : 'var(--c-muted-2)',
                      fontFamily: '"DM Mono", monospace',
                    }}
                  >
                    {project.revenue || project.adSpend ? formatCurrency(profit, project.currency) : '—'}
                  </span>

                  {/* ROI */}
                  <span
                    className="text-[12px] font-medium text-right"
                    style={{
                      color: r === null ? 'var(--c-muted-2)' : r >= 0 ? 'var(--c-accent)' : 'var(--c-danger)',
                      fontFamily: '"DM Mono", monospace',
                    }}
                  >
                    {r === null ? '—' : `${r >= 0 ? '+' : ''}${r.toFixed(0)}%`}
                  </span>

                  {/* Progresso */}
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-12 h-1.5 rounded-full" style={{ background: 'var(--c-border)' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${progress}%`, background: statusColor }}
                      />
                    </div>
                    <span className="text-[11px]" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                      {progress}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-6">
        {/* Pipeline */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--c-text)' }}>Pipeline</h2>
          <div className="rounded-xl border divide-y" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
            {pipeline.map(s => (
              <div key={s.status} className="flex items-center gap-3 px-5 py-3.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="flex-1 text-[13px]" style={{ color: 'var(--c-text)' }}>{s.label}</span>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: s.color, fontFamily: '"DM Mono", monospace' }}
                >
                  {s.count}
                </span>
                {/* Mini bar */}
                <div className="w-16 h-1.5 rounded-full" style={{ background: 'var(--c-border)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${(s.count / projects.length) * 100}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
            {pipeline.length === 0 && (
              <p className="px-5 py-4 text-[13px]" style={{ color: 'var(--c-muted)' }}>Nenhum produto criado ainda.</p>
            )}
          </div>
        </section>

        {/* Alertas */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--c-text)' }}>Alertas</h2>
          <div className="rounded-xl border divide-y" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
            {alerts.length === 0 ? (
              <div className="px-5 py-8 flex flex-col items-center text-center">
                <TrendingUp size={22} style={{ color: 'var(--c-accent)', marginBottom: 8 }} />
                <p className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>Tudo sob controle</p>
                <p className="text-[12px] mt-1" style={{ color: 'var(--c-muted)' }}>Nenhum alerta no momento.</p>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors duration-100"
                  style={{ background: 'var(--c-surface)' }}
                  onClick={() => navigate(`/projeto/${alert.projectId}`)}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-surface)')}
                >
                  {alert.type === 'danger'
                    ? <TrendingDown size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--c-danger)' }} />
                    : <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--c-amber)' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: 'var(--c-text)' }}>{alert.projectName}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: alert.type === 'danger' ? 'var(--c-danger)' : 'var(--c-amber)' }}>
                      {alert.message}
                    </p>
                  </div>
                  <ArrowRight size={13} style={{ color: 'var(--c-muted-2)', flexShrink: 0, marginTop: 2 }} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function SummaryCard({
  label, value, accent, danger,
}: {
  label: string
  value: string
  accent?: boolean
  danger?: boolean
}) {
  const color = danger ? 'var(--c-danger)' : accent ? 'var(--c-accent)' : 'var(--c-text)'
  return (
    <div className="rounded-xl border p-5" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
        {label}
      </p>
      <p className="text-2xl font-semibold leading-none" style={{ color, fontFamily: '"DM Mono", monospace' }}>
        {value}
      </p>
    </div>
  )
}
