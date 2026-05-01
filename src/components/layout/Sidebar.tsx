import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Rocket, LayoutDashboard, CheckSquare, Settings, Plus, ChevronRight, Sun, Moon } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { STATUS_COLORS, getProjectProgress } from '../../utils/helpers'
import { generateId, now } from '../../utils/helpers'
import { blankTemplate } from '../../data/templates'
import type { Project } from '../../types'

export default function Sidebar() {
  const { projects, addProject, showToast, setIsSearchOpen, theme, toggleTheme } = useApp()
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
      style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--c-accent)' }}>
          <Rocket size={14} color="white" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--c-text)', fontFamily: '"Instrument Serif", serif' }}>
          LaunchOS
        </span>
      </div>

      {/* Search */}
      <div className="px-3 mb-3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
          style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)' }}
        >
          <span>Buscar</span>
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--c-border)', color: 'var(--c-muted-2)' }}>⌘K</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        <NavItem to="/" icon={<LayoutDashboard size={15} />} label="Dashboard" active={isActive('/')} />
        <NavItem to="/tarefas-do-dia" icon={<CheckSquare size={15} />} label="Tarefas do Dia" active={isActive('/tarefas-do-dia')} />
        <NavItem to="/configuracoes" icon={<Settings size={15} />} label="Configurações" active={isActive('/configuracoes')} />
      </nav>

      {/* Divider */}
      <div className="mx-3 my-3 border-t" style={{ borderColor: 'var(--c-border)' }} />

      {/* Projects */}
      <div className="px-3 flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Projetos</span>
        <button
          onClick={handleNewProject}
          className="p-0.5 rounded transition-colors duration-150 hover:opacity-80"
          title="Novo projeto"
          style={{ color: 'var(--c-muted)' }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-3">
        {activeProjects.length === 0 && (
          <p className="text-xs px-2 py-2" style={{ color: 'var(--c-muted-3)' }}>Nenhum projeto ainda</p>
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
                background: isProjectActive ? 'var(--c-surface-2)' : 'transparent',
                color: isProjectActive ? 'var(--c-text)' : 'var(--c-text-2)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="flex-1 truncate text-[13px]">{project.name}</span>
              <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{progress}%</span>
              <ChevronRight size={11} className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
            </Link>
          )
        })}

        <button
          onClick={handleQuickCreate}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-[13px] transition-all duration-150 mt-1"
          style={{ color: 'var(--c-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          <Plus size={13} />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Theme toggle */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'var(--c-border)' }}>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] transition-all duration-150"
          style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)' }}
          title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          <span>{theme === 'light' ? 'Modo escuro' : 'Modo claro'}</span>
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
        background: active ? 'var(--c-surface-2)' : 'transparent',
        color: active ? 'var(--c-text)' : 'var(--c-muted)',
      }}
    >
      {icon}
      {label}
    </Link>
  )
}
