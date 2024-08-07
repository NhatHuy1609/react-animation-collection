import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Profiler } from 'react'

function onRenderCallback() {}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Profiler id='App' onRender={onRenderCallback}>
      <App />
    </Profiler>
  </React.StrictMode>
)
