import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { getInitialTheme, applyTheme } from './components/ThemeToggle'
import './index.css'

// تطبيق النمط المحفوظ قبل العرض (تفادي الوميض)
applyTheme(getInitialTheme())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
