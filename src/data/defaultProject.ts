import type { Project } from '../types'
import { infoProductTemplate } from './templates'

function cloneTemplate(): typeof infoProductTemplate {
  return JSON.parse(JSON.stringify(infoProductTemplate)) as typeof infoProductTemplate
}

const phases = cloneTemplate()

// Mark some tasks as completed for demo
const phase1 = phases[0]
phase1.tasks[0].status = 'em-progresso'  // preco-landing
phase1.tasks[1].status = 'concluido'      // produto-entregavel
phase1.tasks[1].completedAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
phase1.tasks[2].status = 'concluido'      // entrega-automatica
phase1.tasks[2].completedAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()

const phase2 = phases[1]
phase2.tasks[0].status = 'concluido'      // timer
phase2.tasks[0].completedAt = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
phase2.tasks[0].notes = 'Timer removido — não consegui configurar um real, então tirei. Vamos testar sem.'
phase2.tasks[1].status = 'em-progresso'  // order-bump

const phase4 = phases[3]
phase4.tasks[0].status = 'concluido'      // politicas
phase4.tasks[0].completedAt = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()

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
