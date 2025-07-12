import React from 'react'

function JsonDataView({ data }) {
  return (
    <div style={{
      background: '#f4f4f4',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      margin: '20px 0',
      maxWidth: '700px',
      width: '100%',
      boxSizing: 'border-box',
      fontSize: '15px',
      overflowX: 'auto',
      textAlign: 'left',
      maxHeight: '400px',
      overflowY: 'auto',
    }}>
      <pre style={{ margin: 0, color: '#222831', fontWeight: 500 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

export default JsonDataView
