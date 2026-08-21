import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { GameStateProvider } from './context/GameStateContext'
import './styles.css'
import './shared/styles/tokens.css'
import './shared/styles/base.css'
import './shared/styles/motion.css'
import './shared/styles/overrides.css'

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => undefined))
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GameStateProvider>
        <App />
      </GameStateProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
