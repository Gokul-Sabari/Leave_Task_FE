import React, { useState, useEffect } from 'react'
import { getAuditLogs } from '@services/api'
import LoadingSpinner from '@components/LoadingSpinner'

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      const response = await getAuditLogs()
      setLogs(response.data)
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionColor = (action) => {
    switch(action) {
      case 'approved':
        return '#48bb78'
      case 'rejected':
        return '#f56565'
      case 'created':
        return '#4299e1'
      default:
        return '#718096'
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h1>Audit Logs</h1>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Entity Type</th>
              <th>Entity ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{formatDate(log.performedAt)}</td>
                <td>
                  {log.user?.name}<br/>
                  <small style={{ color: '#999' }}>{log.user?.email}</small>
                </td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getActionColor(log.action),
                    color: 'white',
                    fontSize: '0.85rem'
                  }}>
                    {log.action.toUpperCase()}
                  </span>
                </td>
                <td>{log.entityType}</td>
                <td>{log.entityId}</td>
                <td>
                  <pre style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    maxWidth: '300px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: '#999' }}>
          No audit logs found
        </div>
      )}
    </div>
  )
}

export default AuditLogs