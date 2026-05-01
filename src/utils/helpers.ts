import type { Project, Phase, Task, TaskStatus, Priority, Difficulty, ProjectStatus, ProductType } from '../types'

export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 9)

export const now = (): string => new Date().toISOString()

export const formatDate = (d: string): string =>
  d ? new Date(d).toLocaleDateString('pt-BR') : '—'

export const formatCurrency = (value: number | undefined, currency = 'USD'): string => {
  if (value === undefined || value === null) return '—'
  if (value >= 1_000_000) return `${currency} ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${currency} ${(value / 1_000).toFixed(0)}K`
  return `${currency} ${value.toLocaleString('pt-BR')}`
}

export const getPhaseProgress = (phase: Phase): number => {
  if (!phase.tasks.length) return 0
  const done = phase.tasks.filter(t => t.status === 'concluido').length
  return Math.round((done / phase.tasks.length) * 100)
}

export const getPhaseStatus = (phase: Phase): 'pendente' | 'em-progresso' | 'concluido' => {
  const done = phase.tasks.filter(t => t.status === 'concluido').length
  const inProgress = phase.tasks.filter(t => t.status === 'em-progresso').length
  if (done === phase.tasks.length && phase.tasks.length > 0) return 'concluido'
  if (done > 0 || inProgress > 0) return 'em-progresso'
  return 'pendente'
}

export const getProjectProgress = (project: Project): number => {
  const allTasks = project.phases.flatMap(p => p.tasks)
  if (!allTasks.length) return 0
  const done = allTasks.filter(t => t.status === 'concluido').length
  return Math.round((done / allTasks.length) * 100)
}

export const getProjectTaskCounts = (project: Project) => {
  const all = project.phases.flatMap(p => p.tasks)
  return {
    total: all.length,
    done: all.filter(t => t.status === 'concluido').length,
    pending: all.filter(t => t.status === 'pendente').length,
    inProgress: all.filter(t => t.status === 'em-progresso').length,
    blocked: all.filter(t => t.status === 'bloqueado').length,
  }
}

export const getNextTask = (project: Project): Task | null => {
  for (const phase of project.phases) {
    const t = phase.tasks.find(t => t.status === 'pendente' || t.status === 'em-progresso')
    if (t) return t
  }
  return null
}

export const getDaysUntilLaunch = (project: Project): number | null => {
  if (!project.targetLaunchDate) return null
  const diff = new Date(project.targetLaunchDate).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const getThisWeekCompleted = (projects: Project[]): number => {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return projects.flatMap(p => p.phases.flatMap(ph => ph.tasks))
    .filter(t => t.completedAt && new Date(t.completedAt).getTime() > weekAgo).length
}

export const getPriorityTasks = (projects: Project[], limit = 5): Array<Task & { projectName: string; projectId: string }> => {
  const order: Record<Priority, number> = { critica: 0, alta: 1, media: 2, baixa: 3 }
  return projects
    .flatMap(p => p.phases.flatMap(ph =>
      ph.tasks
        .filter(t => t.status !== 'concluido')
        .map(t => ({ ...t, projectName: p.name, projectId: p.id }))
    ))
    .sort((a, b) => order[a.priority] - order[b.priority])
    .slice(0, limit)
}

export const getAllInProgressTasks = (projects: Project[]): Array<Task & { projectName: string; projectId: string }> => {
  const order: Priority[] = ['critica', 'alta', 'media', 'baixa']
  return projects
    .flatMap(p => p.phases.flatMap(ph =>
      ph.tasks
        .filter(t => t.status === 'em-progresso' || t.priority === 'critica')
        .filter(t => t.status !== 'concluido')
        .map(t => ({ ...t, projectName: p.name, projectId: p.id }))
    ))
    .sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority))
}

export const getNextLaunchProject = (projects: Project[]): Project | null => {
  const active = projects.filter(p => p.targetLaunchDate && p.status !== 'arquivado')
  if (!active.length) return null
  return active.sort((a, b) =>
    new Date(a.targetLaunchDate!).getTime() - new Date(b.targetLaunchDate!).getTime()
  )[0]
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  ideia: 'Ideia',
  desenvolvimento: 'Em Desenvolvimento',
  'pre-lancamento': 'Pré-lançamento',
  ativo: 'Ativo',
  pausado: 'Pausado',
  arquivado: 'Arquivado',
}

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  ideia: '#666666',
  desenvolvimento: '#f59e0b',
  'pre-lancamento': '#00d084',
  ativo: '#00d084',
  pausado: '#666666',
  arquivado: '#444444',
}

export const TYPE_LABELS: Record<ProductType, string> = {
  'saas': 'SaaS',
  'info-produto': 'Info Produto',
  'curso': 'Curso',
  'mentoria': 'Mentoria',
  'outro': 'Outro',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  critica: '#ef4444',
  alta: '#f59e0b',
  media: '#00d084',
  baixa: '#666666',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  'em-progresso': 'Em Progresso',
  concluido: 'Concluído',
  bloqueado: 'Bloqueado',
}

export const CURRENCIES = ['USD', 'BRL', 'EUR', 'GBP']
export const PLATFORMS = ['Hotmart', 'Kiwify', 'Gumroad', 'Stripe', 'Eduzz', 'Outro']
