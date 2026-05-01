import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Rocket, LayoutDashboard, CheckSquare, Settings, Plus, ChevronRight } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { STATUS_COLORS, getProjectProgress } from '../../utils/helpers'
import { generateId, now } from '../../utils/helpers'
import { blankTemplate } from '../../data/templates'
import type { Project } from '../../types'

export default function Sidebar() {
  const { projects, addProject, showToast, setIsSearchOpen } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  function handleNewProject() {
    navigate('/?new=true')
  }

  function handleQuickCreate() {
    const project: Project = {
      id: generateId(),
      name: 'Novo Projeto',
      description: '',
      type: 'info-produto',
      status: 'ideia',
      phases: blankTemplate,
      tags: [],
      createdAt: now(),
      updatedAt: now(),
    }
    addProject(project)
    navigate(`/projeto/${project.id}`)
    showToast('Projeto criado ✓')
  }

  const activeProjects = projects.filter(p => p.status !== 'arquivado')

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col border-r z-20"
      style={{ background: '#111111', borderColor: '#2a2a2a' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#00d084' }}>
          <Rocket size={14} color="#0a0a0a" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight" style={{ color: '#e8e8e8', fontFamily: '"Instrument Serif", serif' }}>
          LaunchOS
        </span>
      </div>

      {/* Search */}
      <div className="px-3 mb-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
          style={{ background: '#1a1a1a', color: '#666' }}
        >
          <span>Buscar</span>
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: '#2a2a2a', color: '#555' }}>⌘K</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        <NavItem to="/" icon={<LayoutDashboard size={15} />} label="Dashboard" active={isActive('/')} />
        <NavItem to="/tarefas-do-dia" icon={<CheckSquare size={15} />} label="Tarefas do Dia" active={isActive('/tarefas-do-dia')} />
        <NavItem to="/configuracoes" icon={<Settings size={15} />} label="Configurações" active={isActive('/configuracoes')} />
      </nav>

      {/* Divider */}
      <div className="mx-3 my-3 border-t" style={{ borderColor: '#2a2a2a' }} />

      {/* Projects */}
      <div className="px-3 flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#555' }}>Projetos</span>
        <button
          onClick={handleNewProject}
          className="p-0.5 rounded transition-colors duration-150 hover:opacity-80"
          title="Novo projeto"
          style={{ color: '#666' }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-3">
        {activeProjects.length === 0 && (
          <p className="text-xs px-2 py-2" style={{ color: '#444' }}>Nenhum projeto ainda</p>
        )}
        {activeProjects.map(project => {
          const progress = getProjectProgress(project)
          const color = STATUS_COLORS[project.status]
          const isProjectActive = location.pathname === `/projeto/${project.id}`
          return (
            <Link
              key={project.id}
              to={`/projeto/${project.id}`}
              className="flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-all duration-150 group"
              style={{
                background: isProjectActive ? '#1a1a1a' : 'transparent',
                color: isProjectActive ? '#e8e8e8' : '#999',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="flex-1 truncate text-[13px]">{project.name}</span>
              <span className="text-[10px] flex-shrink-0" style={{ color: '#555' }}>{progress}%</span>
              <ChevronRight size={11} className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
            </Link>
          )
        })}

        <button
          onClick={handleQuickCreate}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-[13px] transition-all duration-150 mt-1"
          style={{ color: '#555' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00d084')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}
        >
          <Plus size={13} />
          <span>Novo Projeto</span>
        </button>
      </div>
    </aside>
  )
}

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150"
      style={{
        background: active ? '#1a1a1a' : 'transparent',
        color: active ? '#e8e8e8' : '#777',
      }}
    >
      {icon}
      {label}
    </Link>
  )
}
