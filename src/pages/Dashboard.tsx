import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import MetricCard from '../components/dashboard/MetricCard'
import ProjectCard from '../components/dashboard/ProjectCard'
import NewProjectModal from '../components/modals/NewProjectModal'
import { useApp } from '../contexts/AppContext'
import {
  getProjectProgress,
  getPriorityTasks,
  getThisWeekCompleted,
  getNextLaunchProject,
  getDaysUntilLaunch,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from '../utils/helpers'
import type { Project, Task } from '../types'

export default function Dashboard() {
  const { projects, addProject, updateProject, showToast } = useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showNew, setShowNew] = useState(searchParams.get('new') === 'true')

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowNew(true)
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const activeProjects = projects.filter(p => p.status !== 'arquivado')
  const allTasks = projects.flatMap(p => p.phases.flatMap(ph => ph.tasks))
  const pending = allTasks.filter(t => t.status !== 'concluido').length
  const weekDone = getThisWeekCompleted(projects)
  const nextLaunch = getNextLaunchProject(projects)
  const nextDays = nextLaunch ? getDaysUntilLaunch(nextLaunch) : null

  const priorityTasks = getPriorityTasks(projects, 5)

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

  function handleCreate(project: Project) {
    addProject(project)
    setShowNew(false)
    showToast('Projeto criado ✓')
    navigate(`/projeto/${project.id}`)
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1" style={{ color: '#e8e8e8', fontFamily: '"Instrument Serif", serif' }}>
          Dashboard
        </h1>
        <p className="text-[13px]" style={{ color: '#555' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Projetos ativos"
          value={activeProjects.length}
          accent
        />
        <MetricCard
          label="Tarefas pendentes"
          value={pending}
          warning={pending > 10}
        />
        <MetricCard
          label="Concluídas esta semana"
          value={weekDone}
          accent={weekDone > 0}
          sub={weekDone === 0 ? 'Nenhuma ainda' : undefined}
        />
        <MetricCard
          label="Próximo lançamento"
          value={nextLaunch ? (nextDays === 0 ? 'Hoje!' : nextDays !== null ? `${nextDays}d` : '—') : '—'}
          sub={nextLaunch?.name}
          warning={nextDays !== null && nextDays <= 7}
          accent={nextDays === 0}
        />
      </div>

      {/* Projects */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold" style={{ color: '#e8e8e8' }}>Visão geral dos projetos</h2>
          <button
            onClick={() => setShowNew(true)}
            className="text-[12px] px-3 py-1.5 rounded-lg transition-colors duration-150"
            style={{ background: '#1a1a1a', color: '#00d084', border: '1px solid #2a2a2a' }}
          >
            + Novo Projeto
          </button>
        </div>

        {activeProjects.length === 0 ? (
          <EmptyState onNew={() => setShowNew(true)} />
        ) : (
          <div className="space-y-3">
            {activeProjects
              .sort((a, b) => getProjectProgress(b) - getProjectProgress(a))
              .map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        )}
      </section>

      {/* Priority tasks */}
      {priorityTasks.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold mb-4" style={{ color: '#e8e8e8' }}>Tarefas prioritárias agora</h2>
          <div className="rounded-xl border divide-y" style={{ borderColor: '#2a2a2a', background: '#111111' }}>
            {priorityTasks.map((task: Task & { projectName: string; projectId: string }) => (
              <div key={`${task.projectId}-${task.id}`} className="flex items-center gap-4 px-5 py-3.5">
                <button
                  onClick={() => completeTask(task.projectId, task.id)}
                  className="flex-shrink-0 w-5 h-5 rounded border transition-all duration-150"
                  style={{ borderColor: '#3a3a3a', background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#00d084')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#3a3a3a')}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: '#e8e8e8' }}>{task.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#555' }}>{task.projectName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: `${PRIORITY_COLORS[task.priority]}20`, color: PRIORITY_COLORS[task.priority], fontFamily: '"DM Mono", monospace' }}
                  >
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  <button
                    onClick={() => navigate(`/projeto/${task.projectId}`)}
                    className="text-[11px] px-2 py-1 rounded"
                    style={{ background: '#1a1a1a', color: '#666' }}
                  >
                    Ver projeto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {showNew && (
        <NewProjectModal
          onClose={() => setShowNew(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="rounded-xl border py-16 flex flex-col items-center text-center" style={{ borderColor: '#2a2a2a', background: '#111111' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,208,132,0.1)' }}>
        <CheckCircle size={28} style={{ color: '#00d084' }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#e8e8e8', fontFamily: '"Instrument Serif", serif' }}>
        Seu LaunchOS está esperando
      </h3>
      <p className="text-[13px] mb-6 max-w-xs" style={{ color: '#555' }}>
        Crie seu primeiro projeto e acompanhe cada passo do lançamento em um só lugar.
      </p>
      <button
        onClick={onNew}
        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
        style={{ background: '#00d084', color: '#0a0a0a' }}
      >
        Criar primeiro projeto →
      </button>
    </div>
  )
}
