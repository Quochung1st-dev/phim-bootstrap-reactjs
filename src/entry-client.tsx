import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App'
import { HelmetProvider } from 'react-helmet-async'

const rootElement = document.getElementById('root')

if (rootElement) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
}
