import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import Sidebar from './components/layout/Sidebar'
import ToastContainer from './components/layout/Toast'
import SearchModal from './components/modals/SearchModal'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import TodayTasks from './pages/TodayTasks'
import Settings from './pages/Settings'

function KeyboardShortcuts() {
  const { setIsSearchOpen } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey) {
        navigate('/?new=true')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [setIsSearchOpen, navigate])

  return null
}

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ marginLeft: 220 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projeto/:id" element={<ProjectDetail />} />
          <Route path="/tarefas-do-dia" element={<TodayTasks />} />
          <Route path="/configuracoes" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
      <SearchModal />
      <KeyboardShortcuts />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  )
}
