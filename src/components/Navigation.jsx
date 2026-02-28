import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'

const Navigation = () => {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">HRMS Mini</Link>
      </div>
      
      <div className="nav-menu">
        <Link to="/dashboard" className="nav-item">Dashboard</Link>
        <Link to="/employees" className="nav-item">Employees</Link>
        <Link to="/leaves" className="nav-item">My Leaves</Link>
        
        {hasRole(['employee', 'manager']) && (
          <Link to="/leaves/apply" className="nav-item">Apply Leave</Link>
        )}
        
        {hasRole(['manager', 'hr_admin']) && (
          <Link to="/approvals" className="nav-item">Pending Approvals</Link>
        )}
        
        {hasRole('hr_admin') && (
          <Link to="/audit" className="nav-item">Audit Logs</Link>
        )}
      </div>
      
      <div className="nav-user">
        <span className="user-info">
          {user?.name} ({user?.role?.replace('_', ' ')})
        </span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navigation