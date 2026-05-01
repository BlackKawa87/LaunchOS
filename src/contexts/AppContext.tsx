import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { Project, AppData, ToastItem } from '../types'
import { loadData, saveData } from '../utils/storage'
import { generateId, now } from '../utils/helpers'
import { defaultProject } from '../data/defaultProject'

type Theme = 'light' | 'dark'

interface AppContextType {
  projects: Project[]
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void
  toasts: ToastItem[]
  showToast: (message: string, type?: ToastItem['type']) => void
  removeToast: (id: string) => void
  lastSaved: string | null
  exportData: () => void
  importData: (data: AppData) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | null>(null)

function initializeData(): { projects: Project[]; theme: Theme } {
  const stored = loadData()
  return {
    projects: stored?.projects?.length ? stored.projects : [defaultProject],
    theme: (stored?.settings?.theme as Theme) ?? 'light',
  }
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const init = initializeData()
  const [projects, setProjects] = useState<Project[]>(init.projects)
  const [theme, setTheme] = useState<Theme>(init.theme)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }, [])

  const persistProjects = useCallback((updatedProjects: Project[], currentTheme: Theme) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const data: AppData = {
        projects: updatedProjects,
        settings: { theme: currentTheme, defaultCurrency: 'USD' },
        lastUpdated: now(),
      }
      saveData(data)
      setLastSaved(now())
    }, 500)
  }, [])

  useEffect(() => {
    persistProjects(projects, theme)
  }, [projects, theme, persistProjects])

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [project, ...prev])
  }, [])

  const updateProject = useCallback((updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? { ...updated, updatedAt: now() } : p))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = generateId()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const exportDataFn = useCallback(() => {
    const data: AppData = {
      projects,
      settings: { theme, defaultCurrency: 'USD' },
      lastUpdated: now(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `launchos-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Dados exportados com sucesso ✓')
  }, [projects, theme, showToast])

  const importDataFn = useCallback((data: AppData) => {
    if (data?.projects) {
      setProjects(data.projects)
      showToast('Dados importados com sucesso ✓')
    }
  }, [showToast])

  return (
    <AppContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      toasts,
      showToast,
      removeToast,
      lastSaved,
      exportData: exportDataFn,
      importData: importDataFn,
      isSearchOpen,
      setIsSearchOpen,
      theme,
      toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
