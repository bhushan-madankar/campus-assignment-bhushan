import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ResourceForm from './ResourceForm'
import ResourceList from './ResourceList'
import JsonDataView from './JsonDataView'

function App() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showJson, setShowJson] = useState(false)

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
    <div style={{ minHeight: '100vh', width: '100vw', boxSizing: 'border-box', background: 'linear-gradient(120deg, #232526 0%, #414345 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowX: 'hidden' }}>
      <div style={{ width: '100%', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
        <h1 style={{ textAlign: 'center', marginTop: '32px', marginBottom: '16px', letterSpacing: '1px', fontWeight: 700, color: '#f1f1f1', textShadow: '0 2px 8px #1118' }}>
          Campus Resources Management
        </h1>
        {/* Toggle JSON Data View */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '18px', alignItems: 'center' }}>
          <button
            onClick={() => setShowJson(prev => !prev)}
            style={{
              padding: '10px 24px',
              background: showJson ? '#b71c1c' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              textAlign: 'center',
              margin: '0 auto'
            }}
          >
            {showJson ? 'Hide JSON Data' : 'Show JSON Data'}
          </button>
        </div>
        {/* JSON Data View */}
        {showJson && <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><JsonDataView data={resources} /></div>}
        {/* Add Resource Form */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ minWidth: 320, maxWidth: 600, width: '100%' }}>
            <ResourceForm onResourceAdded={handleResourceAdded} />
          </div>
        </div>
        {/* Display Resources */}
        <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 2vw 40px 2vw', flexWrap: 'wrap', boxSizing: 'border-box' }}>
          <ResourceList 
            resources={resources} 
            loading={loading} 
            error={error} 
            onRefresh={fetchResources} 
            onDelete={handleDeleteResource}
            onUpdate={handleUpdateResource}
          />
        </div>
      </div>
    </div>
  )
}

export default App