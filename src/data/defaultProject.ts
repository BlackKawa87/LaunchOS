import type { Project } from '../types'
import { infoProdutoTemplate } from './templates'

function cloneTemplate(): typeof infoProdutoTemplate {
  return JSON.parse(JSON.stringify(infoProdutoTemplate)) as typeof infoProdutoTemplate
}

const phases = cloneTemplate()

// Phase 1 — Validação (all done)
const phase1 = phases[0]
phase1.tasks[0].status = 'concluido'
phase1.tasks[0].completedAt = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
phase1.tasks[1].status = 'concluido'
phase1.tasks[1].completedAt = new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
phase1.tasks[2].status = 'concluido'
phase1.tasks[2].completedAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()

// Phase 2 — Criação (done)
const phase2 = phases[1]
phase2.tasks[0].status = 'concluido'
phase2.tasks[0].completedAt = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
phase2.tasks[1].status = 'concluido'
phase2.tasks[1].completedAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
phase2.tasks[2].status = 'concluido'
phase2.tasks[2].completedAt = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
phase2.tasks[3].status = 'concluido'
phase2.tasks[3].completedAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()

// Phase 3 — Plataforma & entrega
const phase3 = phases[2]
phase3.tasks[0].status = 'concluido'
phase3.tasks[0].completedAt = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
phase3.tasks[1].status = 'em-progresso'

// Phase 4 — Página de vendas
const phase4 = phases[3]
phase4.tasks[0].status = 'concluido'
phase4.tasks[0].completedAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
phase4.tasks[1].status = 'em-progresso'

// Phase 5 — Legal & técnico
const phase5 = phases[4]
phase5.tasks[0].status = 'concluido'
phase5.tasks[0].completedAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
phase5.tasks[0].notes = 'Políticas geradas via termsfeed.com. Adicionadas no footer e no checkout da Hotmart.'

export const defaultProject: Project = {
  id: 'petlife-ai',
  name: 'PetLife AI',
  description: 'Plano de saúde personalizado para pets gerado com inteligência artificial em menos de 2 minutos.',
  type: 'info-produto',
  status: 'pre-lancamento',
  price: 27,
  priceUpsell: 17,
  currency: 'USD',
  platform: 'Hotmart',
  landingPageUrl: 'https://petlifeai.com',
  targetLaunchDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  tags: ['pets', 'IA', 'saúde animal', 'low ticket'],
  revenue: 0,
  conversions: 0,
  visitors: 0,
  notes: 'Produto principal focado em donos de pets que querem um plano de saúde individualizado. Público: mulheres 25-45, amantes de pets, classe B/C.',
  createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  phases,
}
