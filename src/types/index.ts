export type ProjectStatus = 'ideia' | 'desenvolvimento' | 'pre-lancamento' | 'ativo' | 'pausado' | 'arquivado'
export type ProductType = 'saas' | 'software' | 'marketplace' | 'info-produto' | 'curso' | 'mentoria' | 'outro'
export type TaskStatus = 'pendente' | 'em-progresso' | 'concluido' | 'bloqueado'
export type Priority = 'critica' | 'alta' | 'media' | 'baixa'
export type Difficulty = 'facil' | 'medio' | 'dificil'

export interface Step {
  id: string
  title: string
  description: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  difficulty: Difficulty
  estimatedTime: string
  phaseId: string
  steps: Step[]
  notes: string
  completedAt?: string
}

export interface Phase {
  id: string
  title: string
  description: string
  order: number
  tasks: Task[]
}

export interface Project {
  id: string
  name: string
  description: string
  type: ProductType
  status: ProjectStatus
  price?: number
  priceUpsell?: number
  currency?: string
  platform?: string
  landingPageUrl?: string
  checkoutUrl?: string
  createdAt: string
  updatedAt: string
  targetLaunchDate?: string
  phases: Phase[]
  tags: string[]
  revenue?: number
  adSpend?: number
  conversions?: number
  visitors?: number
  notes?: string
}

export interface AppData {
  projects: Project[]
  settings: {
    theme: 'dark' | 'light'
    defaultCurrency: string
  }
  lastUpdated: string
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
