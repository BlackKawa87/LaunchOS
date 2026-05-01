import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import type { Project, ProductType, ProjectStatus } from '../../types'
import { TEMPLATE_OPTIONS } from '../../data/templates'
import { generateId, now } from '../../utils/helpers'

interface NewProjectModalProps {
  onClose: () => void
  onCreate: (project: Project) => void
}

const PRODUCT_TYPES: { value: ProductType; label: string; icon: string }[] = [
  { value: 'info-produto', label: 'Info Produto', icon: '📦' },
  { value: 'saas', label: 'SaaS', icon: '⚙️' },
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
    templateId: 'info-produto',
  })

  function handleAddTag() {
    const t = form.tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t], tagInput: '' }))
    }
  }

  function handleCreate() {
    const templateOpt = TEMPLATE_OPTIONS.find(t => t.id === form.templateId)
    const phases = JSON.parse(JSON.stringify(templateOpt?.template ?? []))

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl"
        style={{ background: '#111111', border: '1px solid #2a2a2a' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#2a2a2a' }}>
          <div>
            <h2 className="text-[16px] font-semibold" style={{ color: '#e8e8e8', fontFamily: '"Instrument Serif", serif' }}>
              Novo Projeto
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
              Passo {step} de 3
            </p>
          </div>
          <button onClick={onClose} style={{ color: '#555' }}><X size={18} /></button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 px-6 pt-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: s <= step ? '#00d084' : '#2a2a2a' }}
            />
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
                  Nome do projeto *
                </label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: PetLife AI"
                  className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                />
              </div>

              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="O que é esse produto e para quem?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-[13px] resize-none outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                />
              </div>

              <div>
                <label className="block text-[11px] mb-2 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Tipo</label>
                <div className="grid grid-cols-5 gap-2">
                  {PRODUCT_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setForm(f => ({ ...f, type: t.value }))}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-center transition-all duration-150"
                      style={{
                        background: form.type === t.value ? 'rgba(0,208,132,0.1)' : '#1a1a1a',
                        border: `1px solid ${form.type === t.value ? 'rgba(0,208,132,0.4)' : '#2a2a2a'}`,
                      }}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span className="text-[10px]" style={{ color: form.type === t.value ? '#00d084' : '#777' }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Status inicial</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Tags</label>
                  <div className="flex gap-1.5">
                    <input
                      value={form.tagInput}
                      onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                      placeholder="Ex: pets"
                      className="flex-1 px-2.5 py-2 rounded-lg text-[12px] outline-none"
                      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                    />
                    <button onClick={handleAddTag} className="px-2.5 py-2 rounded-lg text-[11px]" style={{ background: '#1a1a1a', color: '#00d084', border: '1px solid #2a2a2a' }}>
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
                          style={{ background: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}
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
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Preço básico</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="27"
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Preço upsell</label>
                  <input
                    type="number"
                    value={form.priceUpsell}
                    onChange={e => setForm(f => ({ ...f, priceUpsell: e.target.value }))}
                    placeholder="17"
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Moeda</label>
                  <select
                    value={form.currency}
                    onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                  >
                    {['USD', 'BRL', 'EUR'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Plataforma</label>
                  <select
                    value={form.platform}
                    onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                  >
                    <option value="">Selecionar...</option>
                    {['Hotmart', 'Kiwify', 'Gumroad', 'Stripe', 'Eduzz', 'Outro'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>URL da Landing Page</label>
                <input
                  type="url"
                  value={form.landingPageUrl}
                  onChange={e => setForm(f => ({ ...f, landingPageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8' }}
                />
              </div>

              <div>
                <label className="block text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>Data alvo de lançamento</label>
                <input
                  type="date"
                  value={form.targetLaunchDate}
                  onChange={e => setForm(f => ({ ...f, targetLaunchDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', colorScheme: 'dark' }}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-[13px]" style={{ color: '#777' }}>Escolha o template de checklist para o projeto:</p>
              {TEMPLATE_OPTIONS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setForm(f => ({ ...f, templateId: t.id }))}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150"
                  style={{
                    background: form.templateId === t.id ? 'rgba(0,208,132,0.08)' : '#1a1a1a',
                    border: `1px solid ${form.templateId === t.id ? 'rgba(0,208,132,0.3)' : '#2a2a2a'}`,
                  }}
                >
                  <div className="flex-1">
                    <p className="text-[13px] font-medium" style={{ color: '#e8e8e8' }}>{t.label}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: '#666' }}>{t.description}</p>
                    {t.tasks > 0 && (
                      <p className="text-[11px] mt-1" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
                        {t.phases} fases · {t.tasks} tarefas
                      </p>
                    )}
                  </div>
                  {form.templateId === t.id && (
                    <Check size={16} style={{ color: '#00d084' }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: '#2a2a2a' }}>
          <button
            onClick={step > 1 ? () => setStep(s => s - 1) : onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-colors duration-150"
            style={{ background: '#1a1a1a', color: '#777', border: '1px solid #2a2a2a' }}
          >
            <ChevronLeft size={14} />
            {step > 1 ? 'Voltar' : 'Cancelar'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !canNext1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
              style={{
                background: canNext1 || step > 1 ? '#00d084' : '#1a1a1a',
                color: canNext1 || step > 1 ? '#0a0a0a' : '#444',
              }}
            >
              Próximo <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!canNext1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium"
              style={{ background: '#00d084', color: '#0a0a0a' }}
            >
              <Check size={14} /> Criar Projeto
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
