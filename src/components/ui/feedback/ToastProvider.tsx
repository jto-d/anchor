'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { Toast } from './Toast'

const ToastContext = createContext<(message: string) => void>(() => {})

/**
 * App-wide transient toast. Renders a single {@link Toast} and exposes a
 * `notify(message)` function via {@link useToast}. The `Toast` already
 * auto-hides, so there's no timer to manage here.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const notify = useCallback((m: string) => setMessage(m), [])
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <Toast message={message} onClose={() => setMessage(null)} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
