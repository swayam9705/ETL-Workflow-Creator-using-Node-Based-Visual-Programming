import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WorkflowProvider } from './contexts/WorkflowContext'
import { InputFileProvider } from './contexts/InputFileContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <WorkflowProvider>
        <InputFileProvider>
          <App />
        </InputFileProvider>
      </WorkflowProvider>
  </StrictMode>,
)
