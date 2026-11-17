import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/RegisterPage'

function App() {
  return (
    <ConfigProvider>
      <AntdApp>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
