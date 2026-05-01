import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useApp()

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="anim-slide-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl pointer-events-auto"
          style={{
            background: 'var(--c-surface)',
            border: `1px solid ${toast.type === 'error' ? '#ef444433' : toast.type === 'info' ? '#3b82f633' : 'var(--c-accent)33'}`,
            minWidth: 240,
            maxWidth: 360,
          }}
        >
          <span style={{ color: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : 'var(--c-accent)' }}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : toast.type === 'info' ? <Info size={16} /> : <CheckCircle size={16} />}
          </span>
          <span className="flex-1 text-sm" style={{ color: 'var(--c-text)' }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--c-text)' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
