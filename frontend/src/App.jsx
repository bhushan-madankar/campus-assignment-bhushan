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

  // Handler to delete a resource by id
  const handleDeleteResource = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`)
      setResources(prev => prev.filter(resource => resource._id !== id))
    } catch (err) {
      alert('Failed to delete resource: ' + (err.response?.data?.message || err.message))
    }
  }

  // Handler to update a resource by id
  const handleUpdateResource = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/resources/${id}`, updatedData)
      setResources(prev => prev.map(resource => resource._id === id ? response.data : resource))
    } catch (err) {
      alert('Failed to update resource: ' + (err.response?.data?.message || err.message))
    }
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
        onDelete={handleDeleteResource}
        onUpdate={handleUpdateResource}
      />
    </div>
  )
}

export default App