import { useState, useRef, useEffect } from 'react'
import type { Project } from '../../types'

interface NotesTabProps {
  project: Project
  onUpdateProject: (project: Project) => void
}

export default function NotesTab({ project, onUpdateProject }: NotesTabProps) {
  const [notes, setNotes] = useState(project.notes || '')
  const [saved, setSaved] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setNotes(project.notes || '')
  }, [project.id, project.notes])

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setNotes(val)
    setSaved(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onUpdateProject({ ...project, notes: val })
      setSaved(true)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder={`Notas livres para ${project.name}...\n\nIdeas, blockers, decisões, links, referências — tudo que for relevante para o projeto.`}
        className="flex-1 w-full rounded-xl p-5 text-[14px] leading-relaxed resize-none outline-none transition-colors duration-150"
        style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          color: 'var(--c-text)',
          minHeight: 400,
          fontFamily: '"DM Sans", sans-serif',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--c-border-2)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--c-border)')}
      />
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-[11px]" style={{ color: 'var(--c-muted-3)', fontFamily: '"DM Mono", monospace' }}>
          {wordCount} palavra{wordCount !== 1 ? 's' : ''}
        </span>
        <span className="text-[11px]" style={{ color: saved ? 'var(--c-accent)' : 'var(--c-amber)', fontFamily: '"DM Mono", monospace' }}>
          {saved ? '✓ Salvo' : 'Salvando...'}
        </span>
      </div>
    </div>
  )
}
