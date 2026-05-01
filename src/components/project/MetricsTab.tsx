import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Project } from '../../types'
import { CURRENCIES, PLATFORMS } from '../../utils/helpers'

interface MetricsTabProps {
  project: Project
  onUpdateProject: (project: Project) => void
}

function MetricInput({ label, value, onChange, type = 'text', prefix }: {
  label: string
  value: string | number | undefined
  onChange: (v: string) => void
  type?: string
  prefix?: string
}) {
  return (
    <div>
      <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
        {label}
      </label>
      <div className="flex items-center">
        {prefix && (
          <span className="px-3 py-2 rounded-l-lg border border-r-0 text-[13px]" style={{ background: 'var(--c-surface-2)', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          className={`flex-1 px-3 py-2 text-[13px] outline-none transition-colors duration-150 ${prefix ? 'rounded-r-lg' : 'rounded-lg'}`}
          style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--c-border-2)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--c-border)')}
        />
      </div>
    </div>
  )
}

export default function MetricsTab({ project, onUpdateProject }: MetricsTabProps) {
  const [local, setLocal] = useState({ ...project })

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    const updated = { ...local, [key]: value }
    setLocal(updated)
    onUpdateProject(updated)
  }

  const conversionRate = local.visitors && local.conversions
    ? ((local.conversions / local.visitors) * 100).toFixed(1)
    : null

  return (
    <div className="space-y-8">
      {/* Links */}
      <section>
        <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>URLs</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Landing Page</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={local.landingPageUrl ?? ''}
                onChange={e => update('landingPageUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none"
                style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
              />
              {local.landingPageUrl && (
                <a href={local.landingPageUrl} target="_blank" rel="noopener noreferrer"
                  className="px-2 py-2 rounded-lg flex items-center" style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)' }}>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Checkout</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={local.checkoutUrl ?? ''}
                onChange={e => update('checkoutUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none"
                style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
              />
              {local.checkoutUrl && (
                <a href={local.checkoutUrl} target="_blank" rel="noopener noreferrer"
                  className="px-2 py-2 rounded-lg flex items-center" style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)' }}>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Precificação</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Moeda</label>
            <select
              value={local.currency ?? 'USD'}
              onChange={e => update('currency', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <MetricInput label="Preço básico" type="number" value={local.price} prefix={local.currency ?? 'USD'} onChange={v => update('price', Number(v))} />
          <MetricInput label="Preço upsell" type="number" value={local.priceUpsell} prefix={local.currency ?? 'USD'} onChange={v => update('priceUpsell', Number(v))} />
          <div>
            <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Plataforma</label>
            <select
              value={local.platform ?? ''}
              onChange={e => update('platform', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
            >
              <option value="">Selecionar...</option>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Revenue */}
      <section>
        <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <MetricInput label="Receita total" type="number" value={local.revenue} prefix={local.currency ?? 'USD'} onChange={v => update('revenue', Number(v))} />
          <MetricInput label="Nº de vendas" type="number" value={local.conversions} onChange={v => update('conversions', Number(v))} />
          <MetricInput label="Visitantes" type="number" value={local.visitors} onChange={v => update('visitors', Number(v))} />
        </div>

        {conversionRate && (
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
            <p className="text-[11px] mb-1" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>TAXA DE CONVERSÃO</p>
            <p className="text-2xl font-semibold" style={{ color: 'var(--c-accent)', fontFamily: '"DM Mono", monospace' }}>{conversionRate}%</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--c-muted)' }}>{local.conversions} vendas / {local.visitors?.toLocaleString('pt-BR')} visitantes</p>
          </div>
        )}
      </section>
    </div>
  )
}
