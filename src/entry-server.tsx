import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { HelmetProvider } from 'react-helmet-async'

export function render(_url: string) {
  const helmetContext: { helmet?: any } = {}
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
  
  return { 
    html, 
    head: helmetContext.helmet 
  }
}
