import { useRef } from 'react'
import { useApp } from '../contexts/AppContext'
import type { AppData } from '../types'

export default function Settings() {
  const { exportData, importData, projects, showToast } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AppData
        importData(data)
      } catch {
        showToast('Arquivo inválido', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1" style={{ color: 'var(--c-text)', fontFamily: '"Instrument Serif", serif' }}>
          Configurações
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>Gerencie seus dados e preferências</p>
      </div>

      <div className="rounded-xl border divide-y" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
        <div className="px-6 py-5">
          <h3 className="text-[14px] font-semibold mb-1" style={{ color: 'var(--c-text)' }}>Exportar dados</h3>
          <p className="text-[12px] mb-4" style={{ color: 'var(--c-muted)' }}>
            Baixe todos os seus projetos como um arquivo JSON. Use como backup ou para migrar para outro dispositivo.
          </p>
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150"
            style={{ background: 'var(--c-surface-2)', color: 'var(--c-accent)', border: '1px solid var(--c-accent)33' }}
          >
            Exportar JSON
          </button>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-[14px] font-semibold mb-1" style={{ color: 'var(--c-text)' }}>Importar dados</h3>
          <p className="text-[12px] mb-4" style={{ color: 'var(--c-muted)' }}>
            Restaure um backup JSON. Atenção: isso substituirá todos os projetos atuais.
          </p>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150"
            style={{ background: 'var(--c-surface-2)', color: 'var(--c-text-2)', border: '1px solid var(--c-border)' }}
          >
            Importar JSON
          </button>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-[14px] font-semibold mb-1" style={{ color: 'var(--c-text)' }}>Resumo</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span style={{ color: 'var(--c-muted)' }}>Total de projetos</span>
              <span style={{ color: 'var(--c-text)', fontFamily: '"DM Mono", monospace' }}>{projects.length}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span style={{ color: 'var(--c-muted)' }}>Total de tarefas</span>
              <span style={{ color: 'var(--c-text)', fontFamily: '"DM Mono", monospace' }}>
                {projects.reduce((acc, p) => acc + p.phases.reduce((a, ph) => a + ph.tasks.length, 0), 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span style={{ color: 'var(--c-muted)' }}>Armazenamento</span>
              <span style={{ color: 'var(--c-text)', fontFamily: '"DM Mono", monospace' }}>
                localStorage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
