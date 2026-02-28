import React, { useState, useEffect } from 'react'
import { getLeaveRequests } from '@services/api'
import LeaveRequestCard from '@components/LeaveRequestCard'
import LoadingSpinner from '@components/LoadingSpinner'

const PendingApprovals = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('submitted')

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await getLeaveRequests({ status: filter })
      setRequests(response.data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const pendingCount = requests.filter(r => r.status === 'submitted').length

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h1>Leave Requests</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          className={`btn ${filter === 'submitted' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('submitted')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`btn ${filter === 'approved' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button
          className={`btn ${filter === 'rejected' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#999' }}>
            No leave requests found
          </div>
        ) : (
          requests.map(request => (
            <LeaveRequestCard 
              key={request.id} 
              request={request}
              onReview={fetchRequests}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default PendingApprovals