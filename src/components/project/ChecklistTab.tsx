import { useMemo } from 'react'
import PhaseSection from './PhaseSection'
import type { Project, Task } from '../../types'
import { getProjectProgress } from '../../utils/helpers'

interface ChecklistTabProps {
  project: Project
  onUpdateProject: (project: Project) => void
}

export default function ChecklistTab({ project, onUpdateProject }: ChecklistTabProps) {
  const progress = getProjectProgress(project)

  function handleUpdateTask(phaseId: string, updatedTask: Task) {
    const phases = project.phases.map(phase => {
      if (phase.id !== phaseId) return phase
      return {
        ...phase,
        tasks: phase.tasks.map(t => t.id === updatedTask.id ? updatedTask : t),
      }
    })
    onUpdateProject({ ...project, phases })
  }

  const firstInProgressPhase = useMemo(() => {
    return project.phases.findIndex(p => p.tasks.some(t => t.status === 'em-progresso' || t.status === 'pendente'))
  }, [project.phases])

  return (
    <div>
      {/* Overall progress */}
      <div className="mb-6 p-4 rounded-xl border" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px]" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Progresso geral</span>
          <span className="text-[13px] font-semibold" style={{ color: 'var(--c-accent)', fontFamily: '"DM Mono", monospace' }}>{progress}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--c-border)' }}>
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: progress >= 50 ? 'var(--c-accent)' : 'var(--c-amber)' }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {project.phases.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--c-muted-3)' }}>
            <p className="text-sm">Nenhuma fase criada.</p>
            <p className="text-xs mt-1" style={{ color: 'var(--c-muted-3)' }}>Edite o projeto para adicionar fases e tarefas.</p>
          </div>
        ) : (
          project.phases
            .sort((a, b) => a.order - b.order)
            .map((phase, idx) => (
              <PhaseSection
                key={phase.id}
                phase={phase}
                onUpdateTask={handleUpdateTask}
                defaultExpanded={idx === firstInProgressPhase || (firstInProgressPhase === -1 && idx === 0)}
              />
            ))
        )}
      </div>

      {/* Print button */}
      <div className="mt-6 flex justify-end no-print">
        <button
          onClick={() => window.print()}
          className="text-[12px] px-4 py-2 rounded-lg transition-colors duration-150"
          style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          Exportar PDF (Imprimir)
        </button>
      </div>
    </div>
  )
}
