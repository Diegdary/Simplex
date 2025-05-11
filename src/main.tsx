import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './extra_styles/template.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
