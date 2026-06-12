import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CmsProvider } from './store/CmsContext'
import ReportPage from './pages/ReportPage'
import AdminPage from './pages/AdminPage'
import './components/components.css'
import './pages/admin.css'

export default function App() {
  return (
    <CmsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReportPage />} />
          <Route path="/years/:year" element={<ReportPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </CmsProvider>
  )
}
