import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Edit3, Archive } from 'lucide-react'
import type { Project, ProjectStatus } from '../../types'
import { STATUS_LABELS, STATUS_COLORS, TYPE_LABELS, getProjectProgress, getProjectTaskCounts, getDaysUntilLaunch } from '../../utils/helpers'
import { useApp } from '../../contexts/AppContext'

interface ProjectHeaderProps {
  project: Project
  onUpdate: (project: Project) => void
}

export default function ProjectHeader({ project, onUpdate }: ProjectHeaderProps) {
  const { deleteProject, showToast } = useApp()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const progress = getProjectProgress(project)
  const counts = getProjectTaskCounts(project)
  const daysUntil = getDaysUntilLaunch(project)

  function handleStatusChange(status: ProjectStatus) {
    onUpdate({ ...project, status })
  }

  function handleDelete() {
    if (confirmDelete) {
      deleteProject(project.id)
      showToast('Projeto excluído')
      navigate('/')
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  function handleArchive() {
    onUpdate({ ...project, status: 'arquivado' })
    showToast('Projeto arquivado')
    navigate('/')
  }

  const statusColor = STATUS_COLORS[project.status]

  return (
    <div className="border-b px-8 py-5" style={{ background: '#111111', borderColor: '#2a2a2a' }}>
      <div className="flex items-start gap-4">
        {/* Left: title + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1
              className="text-2xl font-semibold truncate"
              style={{ color: '#e8e8e8', fontFamily: '"Instrument Serif", serif' }}
            >
              {project.name}
            </h1>
            <span
              className="text-[11px] px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: '#1a1a1a', color: '#888', fontFamily: '"DM Mono", monospace', border: '1px solid #2a2a2a' }}
            >
              {TYPE_LABELS[project.type]}
            </span>
          </div>

          {project.description && (
            <p className="text-[13px] mb-3 leading-relaxed" style={{ color: '#666' }}>{project.description}</p>
          )}

          {/* Metrics row */}
          <div className="flex items-center gap-5 flex-wrap">
            {/* Status selector */}
            <select
              value={project.status}
              onChange={e => handleStatusChange(e.target.value as ProjectStatus)}
              className="text-[12px] px-2.5 py-1 rounded-full outline-none cursor-pointer font-medium"
              style={{
                background: `${statusColor}20`,
                color: statusColor,
                border: `1px solid ${statusColor}40`,
                fontFamily: '"DM Mono", monospace',
              }}
            >
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <span className="text-[12px]" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
              {progress}% concluído
            </span>
            <span className="text-[12px]" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
              {counts.pending + counts.inProgress} tarefa{counts.pending + counts.inProgress !== 1 ? 's' : ''} restante{counts.pending + counts.inProgress !== 1 ? 's' : ''}
            </span>
            {daysUntil !== null && (
              <span
                className="text-[12px] font-medium"
                style={{ color: daysUntil <= 7 ? '#ef4444' : '#555', fontFamily: '"DM Mono", monospace' }}
              >
                {daysUntil < 0 ? `${Math.abs(daysUntil)}d atrasado` : daysUntil === 0 ? 'Lança hoje!' : `${daysUntil}d para lançar`}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate(`/projeto/${project.id}/editar`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-colors duration-150"
            style={{ background: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8e8e8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888')}
          >
            <Edit3 size={13} /> Editar
          </button>
          <button
            onClick={handleArchive}
            className="p-2 rounded-lg transition-colors duration-150"
            style={{ background: '#1a1a1a', color: '#666', border: '1px solid #2a2a2a' }}
            title="Arquivar"
            onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
            onMouseLeave={e => (e.currentTarget.style.color = '#666')}
          >
            <Archive size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg transition-colors duration-150"
            style={{ background: confirmDelete ? 'rgba(239,68,68,0.1)' : '#1a1a1a', color: confirmDelete ? '#ef4444' : '#666', border: `1px solid ${confirmDelete ? '#ef4444' : '#2a2a2a'}` }}
            title={confirmDelete ? 'Clique novamente para confirmar' : 'Excluir'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
