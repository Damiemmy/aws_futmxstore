import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { MaterialDetail } from './pages/MaterialDetail'
import { Upload } from './pages/Upload'

export function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/materials/:id" element={<MaterialDetail />} />
    <Route element={<ProtectedRoute />}><Route path="/upload" element={<Upload />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
