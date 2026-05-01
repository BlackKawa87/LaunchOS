import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProjectHeader from '../components/project/ProjectHeader'
import ChecklistTab from '../components/project/ChecklistTab'
import KanbanTab from '../components/project/KanbanTab'
import NotesTab from '../components/project/NotesTab'
import MetricsTab from '../components/project/MetricsTab'
import { useApp } from '../contexts/AppContext'

type Tab = 'checklist' | 'kanban' | 'notas' | 'metricas'

const TABS: { key: Tab; label: string }[] = [
  { key: 'checklist', label: 'Checklist' },
  { key: 'kanban', label: 'Visão Geral' },
  { key: 'notas', label: 'Notas' },
  { key: 'metricas', label: 'Métricas' },
]

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { projects, updateProject } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('checklist')

  const project = projects.find(p => p.id === id)

  // Keyboard shortcuts for tabs
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const map: Record<string, Tab> = { '1': 'checklist', '2': 'kanban', '3': 'notas', '4': 'metricas' }
      if (map[e.key]) setActiveTab(map[e.key])
      if (e.key === 'e' || e.key === 'E') navigate(`/projeto/${id}/editar`)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  })

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24" style={{ color: 'var(--c-muted)' }}>
        <p className="text-lg mb-4">Projeto não encontrado</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm px-4 py-2 rounded-lg"
          style={{ background: 'var(--c-surface-2)', color: 'var(--c-text-2)' }}
        >
          Voltar ao Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ProjectHeader project={project} onUpdate={updateProject} />

      {/* Tabs */}
      <div className="flex gap-0 border-b px-8" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        {TABS.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-3 text-[13px] font-medium transition-all duration-150 relative"
            style={{ color: activeTab === tab.key ? 'var(--c-text)' : 'var(--c-muted)' }}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px]" style={{ color: 'var(--c-muted-3)', fontFamily: '"DM Mono", monospace' }}>{i + 1}</span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: 'var(--c-accent)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'checklist' && (
          <ChecklistTab project={project} onUpdateProject={updateProject} />
        )}
        {activeTab === 'kanban' && (
          <KanbanTab project={project} onUpdateProject={updateProject} />
        )}
        {activeTab === 'notas' && (
          <NotesTab project={project} onUpdateProject={updateProject} />
        )}
        {activeTab === 'metricas' && (
          <MetricsTab project={project} onUpdateProject={updateProject} />
        )}
      </div>
    </div>
  )
}
