import React from 'react'

function ResourceList({ resources, loading, error, onRefresh }) {
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
                  background: '#f9f9f9'
                }}>
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
