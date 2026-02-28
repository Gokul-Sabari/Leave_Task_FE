import React, { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { reviewLeaveRequest } from '@services/api'
import StatusBadge from './StatusBadge'

const LeaveRequestCard = ({ request, onReview }) => {
  const { user, hasRole } = useAuth()
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const canReview = () => {
    if (!hasRole(['manager', 'hr_admin'])) return false
    if (hasRole('hr_admin')) return true
    // Manager can only review direct reports
    return request.employee?.managerId === user?.id && request.employeeId !== user?.id
  }
  
  const handleReview = async (status) => {
    try {
      setLoading(true)
      await reviewLeaveRequest(request.id, status, comment)
      onReview()
      setComment('')
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to review request')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0' }}>{request.employee?.name}</h3>
          <p style={{ margin: '5px 0', color: '#666' }}>
            {request.employee?.department} • {request.leaveType} Leave
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      
      <div style={{ margin: '15px 0' }}>
        <p><strong>From:</strong> {formatDate(request.startDate)}</p>
        <p><strong>To:</strong> {formatDate(request.endDate)}</p>
        {request.reason && (
          <p><strong>Reason:</strong> {request.reason}</p>
        )}
        {request.reviewComment && (
          <p><strong>Review Comment:</strong> {request.reviewComment}</p>
        )}
        {request.reviewer && (
          <p><strong>Reviewed by:</strong> {request.reviewer.name}</p>
        )}
      </div>
      
      {canReview() && request.status === 'submitted' && (
        <div style={{ marginTop: '15px' }}>
          <textarea
            placeholder="Review comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '10px'
            }}
            rows="2"
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-success"
              onClick={() => handleReview('approved')}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Approve
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleReview('rejected')}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveRequestCard