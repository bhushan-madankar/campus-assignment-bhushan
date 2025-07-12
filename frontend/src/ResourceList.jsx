import React, { useState } from 'react'
import axios from 'axios'

function ResourceList({ resources, loading, error, onRefresh, onDelete, onUpdate }) {
  // Track which resource is being edited
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({ title: '', description: '', resourceType: 'book' })
  const [isUpdating, setIsUpdating] = useState(false)

  // Handler for delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      await onDelete(id)
    }
  }

  // Handler for update button click (start editing)
  const handleEdit = (resource) => {
    setEditId(resource._id)
    setEditData({
      title: resource.title,
      description: resource.description,
      resourceType: resource.resourceType
    })
  }

  // Handler for dismiss button
  const handleDismiss = () => {
    setEditId(null)
    setEditData({ title: '', description: '', resourceType: 'book' })
  }

  // Handler for input changes in edit mode
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  // Handler for update submit
  const handleUpdate = async (id) => {
    setIsUpdating(true)
    try {
      await onUpdate(id, editData)
      setEditId(null)
      setEditData({ title: '', description: '', resourceType: 'book' })
    } catch (err) {
      alert('Failed to update resource: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      <h2>All Resources</h2>
      {error && (
        <div style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>
          {error}
        </div>
      )}
      {loading && <p>Loading...</p>}
      {!loading && !error && (
        <div>
          <h3>Resources Data (JSON Format)</h3>
          <pre style={{ 
            background: '#386ea383', 
            padding: '15px', 
            borderRadius: '5px', 
            overflow: 'auto',
            border: '1px solid #ddd'
          }}>
            {JSON.stringify(resources, null, 2)}
          </pre>
          <h3>Formatted Resources</h3>
          {resources.length === 0 ? (
            <p>No resources found.</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              {resources.map((resource, index) => (
                <div key={resource._id || index} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  background: '#f9f9f9',
                  position: 'relative'
                }}>
                  {editId === resource._id ? (
                    // Edit mode
                    <form onSubmit={e => { e.preventDefault(); handleUpdate(resource._id) }}>
                      <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                        required
                      />
                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                        rows={3}
                        required
                      />
                      <select
                        name="resourceType"
                        value={editData.resourceType}
                        onChange={handleEditChange}
                        style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                      >
                        <option value="book">Book</option>
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                      </select>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '6px 16px',
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                        <button
                          type="button"
                          onClick={handleDismiss}
                          style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '6px 16px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </form>
                  ) : (
                    // View mode
                    <>
                      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                        {resource.title}
                      </h4>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Type:</strong> {resource.resourceType}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Description:</strong> {resource.description}
                      </p>
                      {resource.createdAt && (
                        <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9em' }}>
                          <strong>Created:</strong> {new Date(resource.createdAt).toLocaleDateString()}
                        </p>
                      )}
                      {/* Update button */}
                      <button
                        onClick={() => handleEdit(resource)}
                        style={{
                          position: 'absolute',
                          top: '15px',
                          right: '80px',
                          background: '#ffc107',
                          color: '#333',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          marginRight: '8px'
                        }}
                      >
                        Update
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(resource._id)}
                        style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button 
        onClick={onRefresh}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Refresh Data
      </button>
    </div>
  )
}

export default ResourceList
