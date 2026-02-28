import React, { useState, useEffect } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { getLeaveRequests, getEmployees } from '@services/api'
import { Link } from 'react-router-dom'
import LoadingSpinner from '@components/LoadingSpinner'

const Dashboard = () => {
  const { user, hasRole } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    teamLeaves: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch employees count
      const employeesRes = await getEmployees()
      
      // Fetch leave requests
      const leavesRes = await getLeaveRequests()
      
      const leaves = leavesRes.data
      
      setStats({
        totalEmployees: employeesRes.data.length,
        pendingLeaves: leaves.filter(l => l.status === 'submitted').length,
        approvedLeaves: leaves.filter(l => l.status === 'approved').length,
        rejectedLeaves: leaves.filter(l => l.status === 'rejected').length,
        teamLeaves: leaves.filter(l => 
          l.status === 'submitted' && 
          l.employee?.managerId === user?.id
        ).length
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}!</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        {user?.role === 'hr_admin' && 'You have full access to all HR features.'}
        {user?.role === 'manager' && `You manage the ${user?.department} department.`}
        {user?.role === 'employee' && `You are part of the ${user?.department} department.`}
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <div className="stat-number">{stats.totalEmployees}</div>
        </div>

        {(hasRole(['manager', 'hr_admin'])) && (
          <div className="stat-card">
            <h3>Pending Team Leaves</h3>
            <div className="stat-number">{stats.teamLeaves}</div>
            {stats.teamLeaves > 0 && (
              <Link to="/approvals" style={{ fontSize: '14px', color: '#667eea' }}>
                Review Now →
              </Link>
            )}
          </div>
        )}

        <div className="stat-card">
          <h3>My Pending Leaves</h3>
          <div className="stat-number">{stats.pendingLeaves}</div>
        </div>

        <div className="stat-card">
          <h3>Approved Leaves</h3>
          <div className="stat-number">{stats.approvedLeaves}</div>
        </div>

        <div className="stat-card">
          <h3>Rejected Leaves</h3>
          <div className="stat-number">{stats.rejectedLeaves}</div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
          <Link to="/employees" className="btn btn-primary">
            View Employee Directory
          </Link>
          
          {hasRole(['employee', 'manager']) && (
            <Link to="/leaves/apply" className="btn btn-primary">
              Apply for Leave
            </Link>
          )}
          
          {hasRole(['manager', 'hr_admin']) && stats.teamLeaves > 0 && (
            <Link to="/approvals" className="btn btn-primary">
              Review Pending Approvals ({stats.teamLeaves})
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard