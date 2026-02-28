import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { getLoginEmails } from '@services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [predefinedUsers, setPredefinedUsers] = useState([])
  
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getLoginEmails()
        setPredefinedUsers(response.data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
      }
    }
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    setLoading(false)
  }

  const handleUserSelect = (selectedEmail) => {
    setEmail(selectedEmail)
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'hr_admin': return '#ff6b6b'
      case 'manager': return '#4ecdc4'
      default: return '#95a5a6'
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px', color: '#333', textAlign: 'center' }}>
          HRMS Mini Module
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>
          Employee Directory + Leave Management
        </p>
        
        <div style={{
          background: '#e3f2fd',
          borderLeft: '4px solid #2196f3',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <strong>🎯 Demo Application</strong>
          <p style={{ margin: '5px 0 0' }}>Select a predefined user to login:</p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '20px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {predefinedUsers.map(user => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user.email)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: email === user.email ? '2px solid #667eea' : '1px solid #e0e0e0',
                borderRadius: '6px',
                background: email === user.email ? '#f0f4ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#333' }}>{user.name}</div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>{user.email}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '5px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: getRoleColor(user.role),
                    color: 'white',
                    fontSize: '0.75em',
                    fontWeight: 600
                  }}>
                    {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{
                    background: '#e0e0e0',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75em',
                    color: '#666'
                  }}>
                    {user.department}
                  </span>
                  {user.manager && (
                    <span style={{
                      fontSize: '0.75em',
                      color: '#999',
                      fontStyle: 'italic'
                    }}>
                      Reports to: {user.manager.name}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          margin: '20px 0'
        }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0e0e0' }} />
          <span style={{ padding: '0 10px', color: '#999' }}>OR</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0e0e0' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              list="email-suggestions"
            />
            <datalist id="email-suggestions">
              {predefinedUsers.map(user => (
                <option key={user.id} value={user.email} />
              ))}
            </datalist>
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#666'
        }}>
          <p><strong>Note:</strong> This is a demo application. No password required.</p>
          <p>Simply select a user or enter their email to login.</p>
        </div>
      </div>
    </div>
  )
}

export default Login