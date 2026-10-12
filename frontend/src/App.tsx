import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { MaterialDetail } from './pages/MaterialDetail'
import { Upload } from './pages/Upload'
import { UploadMaterial } from './pages/UploadMaterial'
import { AddCourse } from './pages/AddCourse'
import { Toaster } from 'sonner'

export function App() {
  return (
    <>
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={5500}
        visibleToasts={2}
        expand={false}
        offset="16px"
        mobileOffset="12px"
        toastOptions={{
          classNames: {
            toast: 'futmx-toast',
            title: 'futmx-toast-title',
            description: 'futmx-toast-description',
          },
        }}
      />

    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/materials/:id" element={<MaterialDetail />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<Upload />} />
          <Route path="/upload/material" element={<UploadMaterial />} />
          <Route path="/upload/course" element={<AddCourse />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
