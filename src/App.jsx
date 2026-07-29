import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import TopicSelectPage from './features/topics/TopicSelectPage'
import TestPage from './features/test/TestPage'
import ResultsPage from './features/results/ResultsPage'

export default function App() {
  return (
    <>
      <div className="ledger-grid fixed inset-0 -z-10" />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/topics" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/topics" element={<TopicSelectPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/topics" replace />} />
          </Routes>
        </main>
      </div>
    </>
  )
}
