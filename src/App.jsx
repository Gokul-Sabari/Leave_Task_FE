import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@contexts/AuthContext'
import Login from '@pages/Login'
import Dashboard from '@pages/Dashboard'
import EmployeeDirectory from '@pages/EmployeeDirectory'
import EmployeeProfile from '@pages/EmployeeProfile'
import LeaveRequests from '@pages/LeaveRequests'
import ApplyLeave from '@pages/ApplyLeave'
import PendingApprovals from '@pages/PendingApprovals'
import AuditLogs from '@pages/AuditLogs'
import Navigation from '@components/Navigation'
import LoadingSpinner from '@components/LoadingSpinner'
import './App.css'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, hasRole, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

function AppContent() {
  const { user } = useAuth()
  
  return (
    <div className="App">
      {user && <Navigation />}
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/employees" element={
            <ProtectedRoute>
              <EmployeeDirectory />
            </ProtectedRoute>
          } />
          
          <Route path="/employees/:id" element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/leaves" element={
            <ProtectedRoute>
              <LeaveRequests />
            </ProtectedRoute>
          } />
          
          <Route path="/leaves/apply" element={
            <ProtectedRoute allowedRoles={['employee', 'manager']}>
              <ApplyLeave />
            </ProtectedRoute>
          } />
          
          <Route path="/approvals" element={
            <ProtectedRoute allowedRoles={['manager', 'hr_admin']}>
              <PendingApprovals />
            </ProtectedRoute>
          } />
          
          <Route path="/audit" element={
            <ProtectedRoute allowedRoles={['hr_admin']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App