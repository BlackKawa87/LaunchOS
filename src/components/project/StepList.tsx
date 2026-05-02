import type { Step } from '../../types'

interface StepListProps {
  steps: Step[]
  completedSteps?: string[]
  onToggleStep?: (stepId: string) => void
}

export default function StepList({ steps, completedSteps = [], onToggleStep }: StepListProps) {
  if (!steps.length) return null

  const doneCount = steps.filter(s => completedSteps.includes(s.id)).length

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
          Passo a passo
        </p>
        <span className="text-[11px]" style={{ color: doneCount === steps.length && steps.length > 0 ? 'var(--c-accent)' : 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
          {doneCount}/{steps.length}
        </span>
      </div>

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="h-1 rounded-full" style={{ background: 'var(--c-border)' }}>
          <div
            className="h-1 rounded-full transition-all duration-300"
            style={{ width: `${(doneCount / steps.length) * 100}%`, background: 'var(--c-accent)' }}
          />
        </div>
      )}

      <ol className="space-y-1.5 pt-1">
        {steps.map((step, i) => {
          const done = completedSteps.includes(step.id)
          return (
            <li
              key={step.id}
              className="flex gap-3 rounded-lg px-2 py-2 transition-all duration-150 cursor-pointer group"
              style={{ background: done ? 'var(--c-accent-10)' : 'var(--c-surface-2)' }}
              onClick={() => onToggleStep?.(step.id)}
            >
              {/* Checkbox */}
              <div
                className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 mt-0.5"
                style={{
                  background: done ? 'var(--c-accent)' : 'transparent',
                  borderColor: done ? 'var(--c-accent)' : 'var(--c-border-2)',
                }}
              >
                {done && (
                  <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {!done && (
                  <span className="text-[9px] font-bold opacity-50" style={{ color: 'var(--c-muted)', fontFamily: '"DM Mono", monospace' }}>
                    {i + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-medium leading-snug"
                  style={{ color: done ? 'var(--c-muted)' : 'var(--c-text)', textDecoration: done ? 'line-through' : 'none' }}
                >
                  {step.title}
                </p>
                {!done && (
                  <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--c-muted)' }}>
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
