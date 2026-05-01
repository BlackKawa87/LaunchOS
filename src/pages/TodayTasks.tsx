import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { getAllInProgressTasks, PRIORITY_COLORS, PRIORITY_LABELS } from '../utils/helpers'

export default function TodayTasks() {
  const { projects, updateProject, showToast } = useApp()
  const navigate = useNavigate()

  const tasks = getAllInProgressTasks(projects)

  const byProject = tasks.reduce<Record<string, { projectName: string; tasks: typeof tasks }>>((acc, task) => {
    if (!acc[task.projectId]) acc[task.projectId] = { projectName: task.projectName, tasks: [] }
    acc[task.projectId].tasks.push(task)
    return acc
  }, {})

  function completeTask(projectId: string, taskId: string) {
    const project = projects.find(p => p.id === projectId)
    if (!project) return
    const phases = project.phases.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'concluido' as const, completedAt: new Date().toISOString() }
          : t
      ),
    }))
    updateProject({ ...project, phases })
    showToast('Tarefa concluída ✓')
  }

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1" style={{ color: 'var(--c-text)', fontFamily: '"Instrument Serif", serif' }}>
          Tarefas do Dia
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
          {today} · {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} para fazer
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border py-16 flex flex-col items-center text-center" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--c-text)', fontFamily: '"Instrument Serif", serif' }}>
            Tudo em dia!
          </h3>
          <p className="text-[13px]" style={{ color: 'var(--c-muted)' }}>
            Nenhuma tarefa em progresso ou crítica no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byProject).map(([projectId, { projectName, tasks: ptasks }]) => (
            <div key={projectId}>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => navigate(`/projeto/${projectId}`)}
                  className="text-[13px] font-semibold hover:underline"
                  style={{ color: 'var(--c-accent)' }}
                >
                  {projectName}
                </button>
                <span className="text-[11px]" style={{ color: 'var(--c-muted-3)', fontFamily: '"DM Mono", monospace' }}>
                  {ptasks.length} tarefa{ptasks.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="rounded-xl border divide-y" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
                {ptasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 px-5 py-4">
                    <button
                      onClick={() => completeTask(projectId, task.id)}
                      className="flex-shrink-0 w-5 h-5 rounded border transition-all duration-150"
                      style={{ borderColor: 'var(--c-border-2)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--c-accent)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--c-border-2)')}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>{task.title}</p>
                      {task.description && (
                        <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--c-muted)' }}>{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status === 'em-progresso' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--c-amber)', fontFamily: '"DM Mono", monospace' }}>
                          Em progresso
                        </span>
                      )}
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: `${PRIORITY_COLORS[task.priority]}20`, color: PRIORITY_COLORS[task.priority], fontFamily: '"DM Mono", monospace' }}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                        {task.estimatedTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
