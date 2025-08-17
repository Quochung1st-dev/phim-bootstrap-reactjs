import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Import Custom CSS
import './index.css'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
