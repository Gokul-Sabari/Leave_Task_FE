import React from 'react'

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return 'status-approved'
      case 'rejected':
        return 'status-rejected'
      default:
        return 'status-submitted'
    }
  }

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status || 'submitted'}
    </span>
  )
}

export default StatusBadge