import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ContactPage from './pages/ContactPage'
import ContactSubmissionsPage from './pages/ContactSubmissionsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminContentManagerPage from './pages/AdminContentManagerPage'
import AdminServiceManagerPage from './pages/AdminServiceManagerPage'
import AdminProjectsManagerPage from './pages/AdminProjectsManagerPage'
import AdminEmployeeWorkspacePage from './pages/AdminEmployeeWorkspacePage'
import ProjectChatPage from './pages/ProjectChatPage'
import AdminProjectChatsPage from './pages/AdminProjectChatsPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import EmployeeTasksPage from './pages/EmployeeTasksPage'
import CreatorStudioPage from './pages/CreatorStudioPage'
import CreatorFeedPage from './pages/CreatorFeedPage'
import CustomCursor from './components/CustomCursor'
import useRouteTransition from './hooks/useRouteTransition'

function App() {
  const routeRef = useRouteTransition()

  return (
    <>
      <CustomCursor />
      <div ref={routeRef} className="route-transition-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectIndex" element={<ProjectDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content-manager"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <AdminContentManagerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/service-manager"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <AdminServiceManagerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects-manager"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <AdminProjectsManagerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-chat"
            element={
              <ProtectedRoute>
                <ProjectChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/project-chats"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <AdminProjectChatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employee-manager"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <AdminEmployeeWorkspacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contact-submissions"
            element={
              <ProtectedRoute adminOnly loginPath="/admin">
                <ContactSubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute employeeOnly>
                <EmployeeTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/studio"
            element={
              <ProtectedRoute creatorOnly>
                <CreatorStudioPage />
              </ProtectedRoute>
            }
          />
          <Route path="/creator-feed" element={<CreatorFeedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
