import React from 'react'
import { Link } from 'react-router-dom'

const EmployeeCard = ({ employee }) => {
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'hr_admin':
        return '#ff6b6b'
      case 'manager':
        return '#4ecdc4'
      default:
        return '#95a5a6'
    }
  }

  return (
    <Link to={`/employees/${employee.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>{employee.name}</h3>
            <p style={{ margin: '0', color: '#666' }}>{employee.email}</p>
          </div>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: getRoleBadgeColor(employee.role),
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}>
            {employee.role.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <div style={{ marginTop: '15px' }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Department:</strong> {employee.department}
          </p>
          {employee.manager && (
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Manager:</strong> {employee.manager.name}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default EmployeeCard