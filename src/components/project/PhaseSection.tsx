import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import TaskItem from './TaskItem'
import type { Phase, Task } from '../../types'
import { getPhaseProgress, getPhaseStatus } from '../../utils/helpers'

interface PhaseSectionProps {
  phase: Phase
  onUpdateTask: (phaseId: string, task: Task) => void
  defaultExpanded?: boolean
}

const STATUS_BADGE = {
  pendente: { label: 'Não iniciado', color: '#555' },
  'em-progresso': { label: 'Em progresso', color: '#f59e0b' },
  concluido: { label: 'Concluído', color: '#00d084' },
}

export default function PhaseSection({ phase, onUpdateTask, defaultExpanded = false }: PhaseSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const progress = getPhaseProgress(phase)
  const phaseStatus = getPhaseStatus(phase)
  const done = phase.tasks.filter(t => t.status === 'concluido').length
  const badge = STATUS_BADGE[phaseStatus]

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#2a2a2a' }}>
      {/* Phase header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors duration-150"
        style={{ background: expanded ? '#111111' : '#0d0d0d' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#111111')}
        onMouseLeave={e => (e.currentTarget.style.background = expanded ? '#111111' : '#0d0d0d')}
      >
        <span style={{ color: '#555' }}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-semibold text-[15px]" style={{ color: '#e8e8e8' }}>{phase.title}</h3>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: `${badge.color}20`, color: badge.color, fontFamily: '"DM Mono", monospace' }}
            >
              {badge.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Mini progress bar */}
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full" style={{ background: '#2a2a2a' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: badge.color }}
              />
            </div>
            <span className="text-[11px]" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
              {done}/{phase.tasks.length}
            </span>
          </div>
        </div>
      </button>

      {/* Tasks */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t" style={{ background: '#0a0a0a', borderColor: '#2a2a2a' }}>
          <div className="h-3" />
          {phase.tasks.length === 0 ? (
            <p className="text-[13px] text-center py-4" style={{ color: '#444' }}>Nenhuma tarefa nesta fase</p>
          ) : (
            phase.tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={(updated) => onUpdateTask(phase.id, updated)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
