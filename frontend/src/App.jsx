import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ResourceForm from './ResourceForm'
import ResourceList from './ResourceList'

function App() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/resources')
      setResources(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch resources: ' + err.message)
      console.error('Error fetching resources:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResourceAdded = (newResource) => {
    setResources(prev => [...prev, newResource])
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Campus Resources Management</h1>
      
      {/* Add Resource Form */}
      <ResourceForm onResourceAdded={handleResourceAdded} />
      
      {/* Display Resources */}
      <ResourceList 
        resources={resources} 
        loading={loading} 
        error={error} 
        onRefresh={fetchResources} 
      />
    </div>
  )
}

export default App