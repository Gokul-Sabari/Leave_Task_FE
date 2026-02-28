import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLeaveRequest } from '@services/api'

const ApplyLeave = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    leave_type: 'annual',
    reason: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createLeaveRequest(formData)
      navigate('/leaves')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit leave request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Apply for Leave</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type</label>
            <select
              name="leave_type"
              value={formData.leave_type}
              onChange={handleChange}
              required
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason (Optional)</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              placeholder="Please provide a reason for your leave request..."
            />
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/leaves')}
              style={{ flex: 1, background: '#e0e0e0' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplyLeave