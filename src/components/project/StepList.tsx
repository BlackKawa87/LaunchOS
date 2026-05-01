import type { Step } from '../../types'

interface StepListProps {
  steps: Step[]
}

export default function StepList({ steps }: StepListProps) {
  if (!steps.length) return null

  return (
    <div className="mt-3 space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#555', fontFamily: '"DM Mono", monospace' }}>
        Passo a passo
      </p>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={step.id} className="flex gap-3">
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
              style={{ background: '#1a1a1a', color: '#00d084', fontFamily: '"DM Mono", monospace', border: '1px solid #2a2a2a' }}
            >
              {i + 1}
            </span>
            <div>
              <p className="text-[13px] font-medium mb-0.5" style={{ color: '#e8e8e8' }}>{step.title}</p>
              <p className="text-[12px] leading-relaxed" style={{ color: '#777' }}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
