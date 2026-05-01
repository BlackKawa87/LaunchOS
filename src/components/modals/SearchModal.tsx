import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { TYPE_LABELS, STATUS_LABELS } from '../../utils/helpers'
import type { Task } from '../../types'

interface Result {
  type: 'project' | 'task'
  projectId: string
  projectName: string
  title: string
  sub?: string
  task?: Task
}

export default function SearchModal() {
  const { projects, isSearchOpen, setIsSearchOpen } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') setIsSearchOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [setIsSearchOpen])

  const results: Result[] = query.trim().length < 2 ? [] : (() => {
    const q = query.toLowerCase()
    const items: Result[] = []

    for (const project of projects) {
      if (project.name.toLowerCase().includes(q) || project.description?.toLowerCase().includes(q)) {
        items.push({
          type: 'project',
          projectId: project.id,
          projectName: project.name,
          title: project.name,
          sub: `${TYPE_LABELS[project.type]} · ${STATUS_LABELS[project.status]}`,
        })
      }
      for (const phase of project.phases) {
        for (const task of phase.tasks) {
          if (task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q)) {
            items.push({
              type: 'task',
              projectId: project.id,
              projectName: project.name,
              title: task.title,
              sub: `${project.name} · ${phase.title}`,
              task,
            })
          }
        }
      }
    }
    return items.slice(0, 8)
  })()

  useEffect(() => { setSelected(0) }, [results.length])

  function handleSelect(result: Result) {
    navigate(`/projeto/${result.projectId}`)
    setIsSearchOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) handleSelect(results[selected])
  }

  if (!isSearchOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: 'var(--c-overlay)' }}
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <Search size={16} style={{ color: 'var(--c-muted)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar projetos e tarefas..."
            className="flex-1 text-sm outline-none"
            style={{ background: 'transparent', color: 'var(--c-text)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--c-muted)' }}>
              <X size={14} />
            </button>
          )}
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)' }}>esc</kbd>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="py-2">
            {results.map((result, i) => (
              <button
                key={`${result.projectId}-${result.title}-${i}`}
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100"
                style={{ background: i === selected ? 'var(--c-surface-2)' : 'transparent' }}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'var(--c-surface-2)', color: result.type === 'project' ? 'var(--c-accent)' : 'var(--c-text-2)', fontFamily: '"DM Mono", monospace' }}>
                  {result.type === 'project' ? 'Projeto' : 'Tarefa'}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--c-text)' }}>{result.title}</p>
                  {result.sub && <p className="text-[11px] truncate" style={{ color: 'var(--c-muted)' }}>{result.sub}</p>}
                </div>
              </button>
            ))}
          </div>
        ) : query.length >= 2 ? (
          <p className="px-4 py-4 text-[13px]" style={{ color: 'var(--c-muted)' }}>Nenhum resultado para "{query}"</p>
        ) : (
          <div className="px-4 py-4">
            <p className="text-[12px] mb-2" style={{ color: 'var(--c-muted)' }}>Projetos recentes</p>
            {projects.slice(0, 4).map(p => (
              <button
                key={p.id}
                onClick={() => { navigate(`/projeto/${p.id}`); setIsSearchOpen(false) }}
                className="w-full flex items-center gap-2 py-1.5 text-left"
              >
                <span className="text-[13px]" style={{ color: 'var(--c-text-2)' }}>{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
