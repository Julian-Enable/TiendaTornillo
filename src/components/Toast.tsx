import { useEffect } from 'react'
import './Toast.css'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
  duration?: number
}

function Toast({ message, show, onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  return (
    <div className={`toast ${show ? 'show' : ''}`}>{message}</div>
  )
}

export default Toast 