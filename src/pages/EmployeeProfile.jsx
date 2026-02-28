import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { getEmployee } from '@services/api'
import LoadingSpinner from '@components/LoadingSpinner'
import StatusBadge from '@components/StatusBadge'

const EmployeeProfile = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployee()
  }, [id])

  const fetchEmployee = async () => {
    try {
      const response = await getEmployee(id)
      setEmployee(response.data)
    } catch (error) {
      console.error('Failed to fetch employee:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!employee) {
    return <div>Employee not found</div>
  }

  return (
    <div>
      <h1>{employee.name}</h1>
      
      <div className="card">
        <h2>Contact Information</h2>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Role:</strong> {employee.role.replace('_', ' ').toUpperCase()}</p>
        {employee.manager && (
          <p><strong>Manager:</strong> {employee.manager.name}</p>
        )}
      </div>

      {employee.directReports?.length > 0 && (
        <div className="card">
          <h2>Direct Reports</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {employee.directReports.map(report => (
              <li key={report.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                {report.name} - {report.department}
              </li>
            ))}
          </ul>
        </div>
      )}

      {employee.leaveRequests?.length > 0 && (
        <div className="card">
          <h2>Leave Requests</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employee.leaveRequests.map(leave => (
                  <tr key={leave.id}>
                    <td>{leave.leaveType}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{leave.reason || '-'}</td>
                    <td><StatusBadge status={leave.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeProfile