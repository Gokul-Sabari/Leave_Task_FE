import React, { useState, useEffect } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { getLeaveRequests } from '@services/api'
import LeaveRequestCard from '@components/LeaveRequestCard'
import LoadingSpinner from '@components/LoadingSpinner'

const LeaveRequests = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await getLeaveRequests({ status: filter })
      setRequests(response.data)
    } catch (error) {
      console.error('Failed to fetch leave requests:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h1>My Leave Requests</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="all">All Requests</option>
          <option value="submitted">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#999' }}>
            No leave requests found.
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

export default LeaveRequests