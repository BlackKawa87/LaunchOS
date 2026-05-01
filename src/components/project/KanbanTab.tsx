import { useState, useRef, useCallback } from 'react'
import type { Project, Task, TaskStatus } from '../../types'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/helpers'

interface KanbanTabProps {
  project: Project
  onUpdateProject: (project: Project) => void
}

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'pendente', label: 'Pendente', color: 'var(--c-muted)' },
  { key: 'em-progresso', label: 'Em Progresso', color: 'var(--c-amber)' },
  { key: 'bloqueado', label: 'Bloqueado', color: 'var(--c-danger)' },
  { key: 'concluido', label: 'Concluído', color: 'var(--c-accent)' },
]

interface DragState {
  taskId: string
  fromStatus: TaskStatus
  phaseId: string
  startX: number
  startY: number
  currentX: number
  currentY: number
  isDragging: boolean
}

export default function KanbanTab({ project, onUpdateProject }: KanbanTabProps) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const [hoverCol, setHoverCol] = useState<TaskStatus | null>(null)
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const allTasks = project.phases.flatMap(p =>
    p.tasks.map(t => ({ ...t, phaseName: p.title, phaseId: p.id }))
  )

  function updateTaskStatus(taskId: string, phaseId: string, newStatus: TaskStatus) {
    const phases = project.phases.map(phase => {
      if (phase.id !== phaseId) return phase
      return {
        ...phase,
        tasks: phase.tasks.map(t =>
          t.id === taskId
            ? { ...t, status: newStatus, completedAt: newStatus === 'concluido' ? new Date().toISOString() : t.completedAt }
            : t
        ),
      }
    })
    onUpdateProject({ ...project, phases })
  }

  const handleMouseDown = useCallback((e: React.MouseEvent, task: Task & { phaseId: string }) => {
    e.preventDefault()
    setDrag({
      taskId: task.id,
      fromStatus: task.status,
      phaseId: task.phaseId,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false,
    })

    const onMove = (ev: MouseEvent) => {
      setDrag(prev => {
        if (!prev) return prev
        const moved = Math.abs(ev.clientX - prev.startX) > 5 || Math.abs(ev.clientY - prev.startY) > 5
        return { ...prev, currentX: ev.clientX, currentY: ev.clientY, isDragging: moved }
      })

      for (const [status, el] of Object.entries(colRefs.current)) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (ev.clientX >= rect.left && ev.clientX <= rect.right && ev.clientY >= rect.top && ev.clientY <= rect.bottom) {
          setHoverCol(status as TaskStatus)
          return
        }
      }
      setHoverCol(null)
    }

    const onUp = (_ev: MouseEvent) => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)

      setDrag(prev => {
        if (!prev) return null
        if (prev.isDragging && hoverCol && hoverCol !== prev.fromStatus) {
          updateTaskStatus(prev.taskId, prev.phaseId, hoverCol)
        }
        return null
      })
      setHoverCol(null)

      setTimeout(() => {
        setDrag(currentDrag => {
          if (currentDrag && hoverCol && hoverCol !== currentDrag.fromStatus) {
            updateTaskStatus(currentDrag.taskId, currentDrag.phaseId, hoverCol)
          }
          return null
        })
      }, 0)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverCol, project])

  const draggingTask = drag ? allTasks.find(t => t.id === drag.taskId) : null

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-3" style={{ minHeight: 400 }}>
        {COLUMNS.map(col => {
          const tasks = allTasks.filter(t => t.status === col.key)
          const isHovered = hoverCol === col.key && drag?.isDragging

          return (
            <div
              key={col.key}
              ref={el => { colRefs.current[col.key] = el }}
              className="rounded-xl border p-3 transition-all duration-150"
              style={{
                background: isHovered ? 'var(--c-accent-10)' : 'var(--c-surface-dim)',
                borderColor: isHovered ? 'var(--c-accent)40' : 'var(--c-border)',
              }}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-[12px] font-medium" style={{ color: col.color }}>{col.label}</span>
                <span className="ml-auto text-[11px]" style={{ color: 'var(--c-muted-3)', fontFamily: '"DM Mono", monospace' }}>{tasks.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {tasks.map(task => {
                  const isBeingDragged = drag?.taskId === task.id && drag.isDragging
                  return (
                    <div
                      key={task.id}
                      onMouseDown={e => handleMouseDown(e, task)}
                      className="rounded-lg p-3 border cursor-grab select-none transition-all duration-150"
                      style={{
                        background: isBeingDragged ? 'transparent' : 'var(--c-surface)',
                        borderColor: 'var(--c-border)',
                        opacity: isBeingDragged ? 0.3 : 1,
                        userSelect: 'none',
                      }}
                    >
                      <p className="text-[12px] font-medium mb-2 leading-snug" style={{ color: 'var(--c-text)' }}>{task.title}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: `${PRIORITY_COLORS[task.priority]}20`, color: PRIORITY_COLORS[task.priority], fontFamily: '"DM Mono", monospace' }}
                        >
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{task.phaseName}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Drag ghost */}
      {drag?.isDragging && draggingTask && (
        <div
          className="fixed pointer-events-none z-50 rounded-lg p-3 border shadow-2xl"
          style={{
            left: drag.currentX + 8,
            top: drag.currentY - 20,
            background: 'var(--c-surface)',
            borderColor: 'var(--c-border-2)',
            width: 180,
            opacity: 0.95,
          }}
        >
          <p className="text-[12px] font-medium" style={{ color: 'var(--c-text)' }}>{draggingTask.title}</p>
        </div>
      )}
    </div>
  )
}
