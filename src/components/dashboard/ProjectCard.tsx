import { useNavigate } from 'react-router-dom'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { getProjectProgress, getNextTask, getDaysUntilLaunch, STATUS_LABELS, STATUS_COLORS, TYPE_LABELS } from '../../utils/helpers'
import type { Project } from '../../types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()
  const progress = getProjectProgress(project)
  const nextTask = getNextTask(project)
  const daysUntil = getDaysUntilLaunch(project)
  const statusColor = STATUS_COLORS[project.status]
  const isUrgent = daysUntil !== null && daysUntil <= 7 && daysUntil >= 0

  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDash = (progress / 100) * circumference

  return (
    <div
      className="rounded-xl border p-5 flex gap-5 cursor-pointer transition-all duration-150 group"
      style={{
        background: '#111111',
        borderColor: '#2a2a2a',
        borderLeftColor: statusColor,
        borderLeftWidth: 3,
      }}
      onClick={() => navigate(`/projeto/${project.id}`)}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#2a2a2a'
        e.currentTarget.style.borderLeftColor = statusColor
      }}
    >
      {/* Progress Ring */}
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={radius} fill="none" stroke="#2a2a2a" strokeWidth="3" />
          <circle
            cx="24" cy="24" r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            transform="rotate(-90 24 24)"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
          <text x="24" y="28" textAnchor="middle" fill="#e8e8e8" fontSize="9" fontFamily="DM Mono, monospace" fontWeight="600">
            {progress}%
          </text>
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-base truncate" style={{ color: '#e8e8e8' }}>{project.name}</h3>
          <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#1a1a1a', color: '#888', fontFamily: '"DM Mono", monospace' }}>
            {TYPE_LABELS[project.type]}
          </span>
          {isUrgent && (
            <span className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full anim-pulse" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              <AlertTriangle size={9} />
              {daysUntil === 0 ? 'Hoje!' : `${daysUntil}d`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${statusColor}20`, color: statusColor, fontFamily: '"DM Mono", monospace' }}
          >
            {STATUS_LABELS[project.status]}
          </span>
          {daysUntil !== null && !isUrgent && daysUntil > 0 && (
            <span className="text-[11px]" style={{ color: '#555' }}>🗓 {daysUntil} dias</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full mb-2.5" style={{ background: '#2a2a2a' }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: statusColor }}
          />
        </div>

        {nextTask && (
          <p className="text-[12px] truncate" style={{ color: '#666' }}>
            <span style={{ color: '#444' }}>Próxima: </span>
            {nextTask.title}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 flex items-center">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 opacity-0 group-hover:opacity-100"
          style={{ background: '#1a1a1a', color: '#00d084' }}
          onClick={e => { e.stopPropagation(); navigate(`/projeto/${project.id}`) }}
        >
          Abrir
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
