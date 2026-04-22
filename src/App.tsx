import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { BottomNav } from '@/components/BottomNav'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ConfirmEmail from '@/pages/ConfirmEmail'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Dashboard from '@/pages/Dashboard'
import Exercises from '@/pages/Exercises'
import ExerciseProgress from '@/pages/ExerciseProgress'
import LogWorkout from '@/pages/LogWorkout'
import NewSession from '@/pages/NewSession'
import Schedule from '@/pages/Schedule'
import Templates from '@/pages/Templates'
import NewTemplate from '@/pages/NewTemplate'
import TemplateDetail from '@/pages/TemplateDetail'
import Calendar from '@/pages/Calendar'
import Profile from '@/pages/Profile'
import LogChoice from '@/pages/LogChoice'
import NewRunSession from '@/pages/NewRunSession'
import RunChoice from '@/pages/RunChoice'
import ScheduleRun from '@/pages/ScheduleRun'
import RunSessionDetail from '@/pages/RunSessionDetail'
import RunSessions from '@/pages/RunSessions'

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-background">
      <div key={location.pathname} className="animate-fadeIn pb-16">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/sessions/new" element={<NewSession />} />
                <Route path="/sessions/:id" element={<LogWorkout />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercises/:id/progress" element={<ExerciseProgress />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/templates/new" element={<NewTemplate />} />
                <Route path="/templates/:id" element={<TemplateDetail />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/log" element={<LogChoice />} />
                <Route path="/runs" element={<RunSessions />} />
                <Route path="/runs/new" element={<NewRunSession />} />
                <Route path="/runs/choose" element={<RunChoice />} />
                <Route path="/runs/schedule" element={<ScheduleRun />} />
                <Route path="/runs/:id" element={<RunSessionDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
