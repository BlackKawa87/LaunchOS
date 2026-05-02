import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import type { Project, ProductType, ProjectStatus } from '../../types'
import { templatesByType, blankTemplate } from '../../data/templates'
import { generateId, now } from '../../utils/helpers'

interface NewProjectModalProps {
  onClose: () => void
  onCreate: (project: Project) => void
}

const PRODUCT_TYPES: { value: ProductType; label: string; icon: string }[] = [
  { value: 'info-produto', label: 'Info Produto', icon: '📦' },
  { value: 'saas', label: 'SaaS', icon: '⚙️' },
  { value: 'software', label: 'Software', icon: '💻' },
  { value: 'marketplace', label: 'Marketplace', icon: '🛒' },
  { value: 'curso', label: 'Curso', icon: '🎓' },
  { value: 'mentoria', label: 'Mentoria', icon: '🎯' },
  { value: 'outro', label: 'Outro', icon: '✨' },
]

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'ideia', label: 'Ideia' },
  { value: 'desenvolvimento', label: 'Em Desenvolvimento' },
  { value: 'pre-lancamento', label: 'Pré-lançamento' },
  { value: 'ativo', label: 'Ativo' },
]

export default function NewProjectModal({ onClose, onCreate }: NewProjectModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'info-produto' as ProductType,
    status: 'desenvolvimento' as ProjectStatus,
    tags: [] as string[],
    tagInput: '',
    price: '',
    priceUpsell: '',
    currency: 'USD',
    platform: '',
    landingPageUrl: '',
    targetLaunchDate: '',
  })

  function handleAddTag() {
    const t = form.tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t], tagInput: '' }))
    }
  }

  function handleCreate() {
    const templatePhases = templatesByType[form.type] ?? blankTemplate
    const phases = JSON.parse(JSON.stringify(templatePhases))

    const project: Project = {
      id: generateId(),
      name: form.name,
      description: form.description,
      type: form.type,
      status: form.status,
      price: form.price ? Number(form.price) : undefined,
      priceUpsell: form.priceUpsell ? Number(form.priceUpsell) : undefined,
      currency: form.currency || 'USD',
      platform: form.platform || undefined,
      landingPageUrl: form.landingPageUrl || undefined,
      targetLaunchDate: form.targetLaunchDate || undefined,
      tags: form.tags,
      phases,
      createdAt: now(),
      updatedAt: now(),
    }
    onCreate(project)
  }

  const canNext1 = form.name.trim().length >= 2
  const previewPhases = templatesByType[form.type] ?? blankTemplate
  const totalTasks = previewPhases.reduce((acc, p) => acc + p.tasks.length, 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--c-overlay)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl"
        style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <div>
            <h2 className="text-[16px] font-semibold" style={{ color: 'var(--c-text)', fontFamily: '"Instrument Serif", serif' }}>
              Novo Projeto
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
              Passo {step} de 2
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--c-muted)' }}><X size={18} /></button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 px-6 pt-4">
          {[1, 2].map(s => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: s <= step ? 'var(--c-accent)' : 'var(--c-border)' }}
            />
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                  Nome do projeto *
                </label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: PetLife AI"
                  className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                  style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="O que é esse produto e para quem?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-[13px] resize-none outline-none"
                  style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] mb-2 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Tipo</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRODUCT_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setForm(f => ({ ...f, type: t.value }))}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-center transition-all duration-150"
                      style={{
                        background: form.type === t.value ? 'var(--c-accent-10)' : 'var(--c-surface-2)',
                        border: `1px solid ${form.type === t.value ? 'var(--c-accent)40' : 'var(--c-border)'}`,
                      }}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span className="text-[10px]" style={{ color: form.type === t.value ? 'var(--c-accent)' : 'var(--c-muted)' }}>{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Phase preview */}
                {previewPhases.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)' }}>
                    <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                      Template aplicado · {previewPhases.length} fases · {totalTasks} tarefas
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {previewPhases.map((phase, i) => (
                        <span
                          key={phase.id}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--c-border)', color: 'var(--c-text-2)' }}
                        >
                          {i + 1}. {phase.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Status inicial</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Tags</label>
                  <div className="flex gap-1.5">
                    <input
                      value={form.tagInput}
                      onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                      placeholder="Ex: pets"
                      className="flex-1 px-2.5 py-2 rounded-lg text-[12px] outline-none"
                      style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                    />
                    <button onClick={handleAddTag} className="px-2.5 py-2 rounded-lg text-[11px]" style={{ background: 'var(--c-surface-2)', color: 'var(--c-accent)', border: '1px solid var(--c-border)' }}>
                      +
                    </button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {form.tags.map(tag => (
                        <span
                          key={tag}
                          onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}
                          className="text-[10px] px-2 py-0.5 rounded-full cursor-pointer"
                          style={{ background: 'var(--c-surface-2)', color: 'var(--c-text-2)', border: '1px solid var(--c-border)' }}
                        >
                          {tag} ×
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Preço básico</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="27"
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Preço upsell</label>
                  <input
                    type="number"
                    value={form.priceUpsell}
                    onChange={e => setForm(f => ({ ...f, priceUpsell: e.target.value }))}
                    placeholder="17"
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Moeda</label>
                  <select
                    value={form.currency}
                    onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                  >
                    {['USD', 'BRL', 'EUR'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Plataforma</label>
                  <select
                    value={form.platform}
                    onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                  >
                    <option value="">Selecionar...</option>
                    {['Hotmart', 'Kiwify', 'Gumroad', 'Stripe', 'Eduzz', 'Outro'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>URL da Landing Page</label>
                <input
                  type="url"
                  value={form.landingPageUrl}
                  onChange={e => setForm(f => ({ ...f, landingPageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Data alvo de lançamento</label>
                <input
                  type="date"
                  value={form.targetLaunchDate}
                  onChange={e => setForm(f => ({ ...f, targetLaunchDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: 'var(--c-border)' }}>
          <button
            onClick={step > 1 ? () => setStep(s => s - 1) : onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-colors duration-150"
            style={{ background: 'var(--c-surface-2)', color: 'var(--c-text-2)', border: '1px solid var(--c-border)' }}
          >
            <ChevronLeft size={14} />
            {step > 1 ? 'Voltar' : 'Cancelar'}
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
              style={{
                background: canNext1 ? 'var(--c-accent)' : 'var(--c-surface-2)',
                color: canNext1 ? 'white' : 'var(--c-muted)',
              }}
            >
              Próximo <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!canNext1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium"
              style={{ background: 'var(--c-accent)', color: 'white' }}
            >
              <Check size={14} /> Criar Projeto
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
