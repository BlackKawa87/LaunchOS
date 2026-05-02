import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import StepList from './StepList'
import type { Task, TaskStatus } from '../../types'
import { PRIORITY_LABELS, PRIORITY_COLORS, DIFFICULTY_LABELS } from '../../utils/helpers'

interface TaskItemProps {
  task: Task
  onUpdate: (task: Task) => void
}

const STATUS_CYCLE: TaskStatus[] = ['pendente', 'em-progresso', 'bloqueado', 'concluido']

const STATUS_COLORS: Record<TaskStatus, string> = {
  pendente: 'var(--c-muted-2)',
  'em-progresso': 'var(--c-amber)',
  concluido: 'var(--c-accent)',
  bloqueado: 'var(--c-danger)',
}

const STATUS_BG: Record<TaskStatus, string> = {
  pendente: 'transparent',
  'em-progresso': 'rgba(245,158,11,0.06)',
  concluido: 'rgba(0,208,132,0.06)',
  bloqueado: 'rgba(239,68,68,0.06)',
}

export default function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(task.notes || '')
  const [checking, setChecking] = useState(false)
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDone = task.status === 'concluido'

  useEffect(() => {
    setNotes(task.notes || '')
  }, [task.notes])

  function handleCheck() {
    if (checking) return
    const newStatus: TaskStatus = isDone ? 'pendente' : 'concluido'
    setChecking(true)
    setTimeout(() => {
      onUpdate({
        ...task,
        status: newStatus,
        completedAt: newStatus === 'concluido' ? new Date().toISOString() : undefined,
      })
      setChecking(false)
    }, 200)
  }

  function handleStatusChange(status: TaskStatus) {
    onUpdate({ ...task, status })
  }

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setNotes(val)
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      onUpdate({ ...task, notes: val })
    }, 800)
  }

  return (
    <div
      className="rounded-lg border transition-all duration-150"
      style={{
        background: isDone ? 'var(--c-accent-10)' : STATUS_BG[task.status],
        borderColor: isDone ? 'var(--c-accent)33' : task.priority === 'critica' ? 'var(--c-danger)33' : 'var(--c-border)',
      }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button
          onClick={handleCheck}
          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all duration-200 border"
          style={{
            background: isDone ? 'var(--c-accent)' : 'transparent',
            borderColor: isDone ? 'var(--c-accent)' : 'var(--c-border-2)',
          }}
        >
          {isDone && (
            <svg className="anim-check" width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Title */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-1 text-left flex items-center gap-2 min-w-0"
        >
          <span
            className={`text-sm font-medium transition-all duration-300 truncate ${isDone ? 'line-through-anim' : ''}`}
            style={{ color: isDone ? 'var(--c-muted)' : 'var(--c-text)' }}
          >
            {task.title}
          </span>
        </button>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{
              background: `${PRIORITY_COLORS[task.priority]}20`,
              color: PRIORITY_COLORS[task.priority],
              fontFamily: '"DM Mono", monospace',
            }}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
            {DIFFICULTY_LABELS[task.difficulty]}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
            {task.estimatedTime}
          </span>
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-shrink-0 transition-transform duration-150"
          style={{ color: 'var(--c-muted)' }}
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--c-border)' }}>
          {task.description && (
            <p className="text-[13px] mt-3 leading-relaxed" style={{ color: 'var(--c-text-2)' }}>{task.description}</p>
          )}

          <StepList
            steps={task.steps}
            completedSteps={task.completedSteps ?? []}
            onToggleStep={stepId => {
              const current = task.completedSteps ?? []
              const updated = current.includes(stepId)
                ? current.filter(id => id !== stepId)
                : [...current, stepId]
              onUpdate({ ...task, completedSteps: updated })
            }}
          />

          {/* Status buttons */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Status:</span>
            {STATUS_CYCLE.map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className="text-[11px] px-2.5 py-1 rounded-full transition-all duration-150"
                style={{
                  background: task.status === s ? `${STATUS_COLORS[s]}20` : 'var(--c-surface-2)',
                  color: task.status === s ? STATUS_COLORS[s] : 'var(--c-muted)',
                  border: `1px solid ${task.status === s ? STATUS_COLORS[s] + '40' : 'var(--c-border)'}`,
                  fontFamily: '"DM Mono", monospace',
                }}
              >
                {s === 'pendente' ? 'Pendente' : s === 'em-progresso' ? 'Em Progresso' : s === 'bloqueado' ? 'Bloqueado' : 'Concluído'}
              </button>
            ))}
          </div>

          {/* Notes */}
          <div className="mt-4">
            <p className="text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>Notas</p>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Anote observações, bloqueios ou descobertas aqui..."
              rows={3}
              className="w-full rounded-lg px-3 py-2 text-[13px] resize-none outline-none transition-colors duration-150"
              style={{
                background: 'var(--c-surface-dim)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--c-border-2)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--c-border)')}
            />
          </div>
        </div>
      )}
    </div>
  )
}
