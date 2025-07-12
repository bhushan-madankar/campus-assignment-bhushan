import React, { useState } from 'react'
import axios from 'axios'

function ResourceList({ resources, loading, error, onRefresh, onDelete, onUpdate }) {
  // Track which resource is being edited
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({ title: '', description: '', resourceType: 'book' })
  const [isUpdating, setIsUpdating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', description: '', resourceType: '', createdAt: '' })
  // Filter state
  const [activeFilter, setActiveFilter] = useState('')
  const filterOptions = [
    { label: 'Campus', value: 'campus' },
    { label: 'Book', value: 'book' },
    { label: 'Article', value: 'article' },
    { label: 'Guidance', value: 'guidance' },
    { label: 'Help', value: 'help' },
  ]

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

  // Open modal with full resource content
  const handleReadMore = (resource) => {
    setModalContent(resource)
    setModalOpen(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false)
    setModalContent({ title: '', description: '', resourceType: '', createdAt: '' })
  }

  // Filter resources by keyword in title, description, or resourceType (case-insensitive)
  const filteredResources = activeFilter
    ? resources.filter(r => {
        const desc = r.description ? r.description.toLowerCase() : ''
        const type = r.resourceType ? r.resourceType.toLowerCase() : ''
        const title = r.title ? r.title.toLowerCase() : ''
        return desc.includes(activeFilter) || type.includes(activeFilter) || title.includes(activeFilter)
      })
    : resources

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '24px 0 12px 0', color: '#5780a7ff' }}>All Resources</h1>
      {/* Filter options */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(activeFilter === opt.value ? '' : opt.value)}
            style={{
              background: activeFilter === opt.value ? '#1976d2' : '#e3f0ff',
              color: activeFilter === opt.value ? 'white' : '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: '6px',
              padding: '6px 18px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: activeFilter === opt.value ? '0 2px 8px rgba(30,34,90,0.10)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        ))}
        {activeFilter && (
          <button
            onClick={() => setActiveFilter('')}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 18px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              marginLeft: '8px',
            }}
          >
            Clear Filter
          </button>
        )}
      </div>
      {error && (
        <div style={{ color: 'red', background: '#5780a7ff', padding: '10px', borderRadius: '5px' }}>
          {error}
        </div>
      )}
      {loading && <p>Loading...</p>}
      {!loading && !error && (
        <div style={{ width: '100%' }}>
          {/* Display resources or a message if none are available */}
          {filteredResources.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No resources found.</p>
          ) : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '32px',
              marginTop: '20px',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'stretch',
            }}>
              {filteredResources.map((resource, index) => {
                const isLong = resource.description && resource.description.length > 180
                const preview = isLong ? resource.description.slice(0, 180) + '...' : resource.description
                return (
                  <div
                    key={resource._id || index}
                    style={{
                      flex: '1 1 calc(25% - 32px)',
                      maxWidth: 'calc(25% - 32px)',
                      minWidth: 260,
                      margin: '0',
                      border: '1px solid #1976d2',
                      borderRadius: '16px',
                      padding: '22px',
                      background: 'linear-gradient(135deg, #e3f0ff 0%, #b3c6e6 100%)',
                      color: '#1a237e',
                      position: 'relative',
                      boxShadow: '0 4px 24px rgba(30,34,90,0.10)',
                      transition: 'transform 0.18s, box-shadow 0.18s',
                      cursor: 'pointer',
                      minHeight: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,34,90,0.18)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(30,34,90,0.10)';
                    }}
                  >
                    {/* Resource type at top left */}
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '22px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#1976d2',
                      background: '#e3f0ff',
                      borderRadius: '8px',
                      padding: '2px 12px',
                      boxShadow: '0 2px 8px rgba(30,34,90,0.07)'
                    }}>{resource.resourceType}</span>
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
                        <h4 style={{
                          margin: '0 0 10px 0',
                          color: '#1a237e',
                          textAlign: 'left',
                          alignSelf: 'flex-start',
                          fontWeight: 700,
                          fontSize: '1.18rem',
                          letterSpacing: '0.5px',
                          paddingTop: '38px', // Add space for buttons
                          minHeight: '1.5em',
                          maxWidth: 'calc(100% - 120px)', // Prevent overlap with buttons
                          boxSizing: 'border-box'
                        }}>
                          {resource.title}
                        </h4>
                        <p style={{ margin: '5px 0', color: '#666', minHeight: '2.5em', wordBreak: 'break-word' }}>
                          <strong>Description:</strong> {preview}
                        </p>
                        {isLong && (
                          <button
                            onClick={() => handleReadMore(resource)}
                            style={{
                              background: '#1976d2',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              padding: '6px 16px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              margin: '8px 0 0 0',
                              fontWeight: 600,
                              boxShadow: '0 2px 8px rgba(30,34,90,0.07)'
                            }}
                          >
                            Read Full Article
                          </button>
                        )}
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
                )
              })}
            </div>
          )}
          {/* Modal for full article */}
          {modalOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(44, 62, 80, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #e3f0ff 0%, #b3c6e6 100%)',
                color: '#1a237e',
                borderRadius: '18px',
                boxShadow: '0 8px 32px rgba(30,34,90,0.18)',
                padding: '32px',
                maxWidth: '600px',
                width: '90vw',
                position: 'relative',
                textAlign: 'left',
                wordBreak: 'break-word',
              }}>
                <button
                  onClick={handleCloseModal}
                  style={{
                    position: 'absolute',
                    top: '18px',
                    right: '18px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '6px 16px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(30,34,90,0.07)'
                  }}
                >
                  Close
                </button>
                <span style={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#1976d2',
                  background: '#e3f0ff',
                  borderRadius: '8px',
                  padding: '2px 12px',
                  boxShadow: '0 2px 8px rgba(30,34,90,0.07)',
                  position: 'absolute',
                  top: '18px',
                  left: '18px',
                }}>{modalContent.resourceType}</span>
                <h2 style={{ margin: '48px 0 18px 0', color: '#1a237e', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.5px' }}>{modalContent.title}</h2>
                <div style={{ fontSize: '1.08rem', color: '#222', marginBottom: '18px', whiteSpace: 'pre-line' }}>{modalContent.description}</div>
                {modalContent.createdAt && (
                  <div style={{ color: '#888', fontSize: '0.95em', marginTop: '8px' }}>
                    <strong>Created:</strong> {new Date(modalContent.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
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
