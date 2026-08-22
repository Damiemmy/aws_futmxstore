import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { useAuthStore } from './store/auth'
import './index.css'

function Bootstrap() {
  const hydrate = useAuthStore((state) => state.hydrate)
  useEffect(() => { void hydrate() }, [hydrate])
  return <App />
}

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Bootstrap /></BrowserRouter></StrictMode>)
