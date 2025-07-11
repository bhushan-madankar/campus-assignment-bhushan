// Import React and useState for managing component state
import React, { useState } from 'react'
// Import axios for making HTTP requests
import axios from 'axios'

// ResourceForm is a component for adding a new resource
// It takes a prop 'onResourceAdded' which is a callback to update the parent component after adding
function ResourceForm({ onResourceAdded }) {
  // State to hold form input values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'book' // Default value
  })
  // State to show loading state when submitting
  const [isSubmitting, setIsSubmitting] = useState(false)
  // State to show messages (success or error)
  const [submitMessage, setSubmitMessage] = useState('')

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target
    // Update the corresponding field in formData
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page reload
    
    // Basic validation: check if required fields are filled
    if (!formData.title.trim() || !formData.description.trim()) {
      setSubmitMessage('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true) // Show loading state
      setSubmitMessage('') // Clear previous messages
      
      // Send POST request to backend API
      const response = await axios.post('http://localhost:5000/api/resources', formData)
      
      // Clear form on success
      setFormData({
        title: '',
        description: '',
        resourceType: 'book'
      })
      
      setSubmitMessage('Resource added successfully!')
      
      // Call parent callback to refresh the list
      if (onResourceAdded) {
        onResourceAdded(response.data)
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitMessage('')
      }, 3000)
      
    } catch (error) {
      // Handle errors from the API
      console.error('Error adding resource:', error)
      setSubmitMessage('Failed to add resource: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsSubmitting(false) // Reset loading state
    }
  }

  // Render the form UI
  return (
    <div style={{
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #dee2e6',
      marginBottom: '30px'
    }}>
      <h2 style={{ marginTop: 0, color: '#333' }}>Add New Resource</h2>
      
      {/* Form for adding a resource */}
      <form onSubmit={handleSubmit}>
        {/* Title input field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#555'
          }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter resource title"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {/* Description textarea field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#555'
          }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter resource description"
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
            required
          />
        </div>

        {/* Resource type dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#555'
          }}>
            Resource Type
          </label>
          <select
            name="resourceType"
            value={formData.resourceType}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          >
            <option value="book">Book</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: isSubmitting ? '#6c757d' : '#28a745',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {isSubmitting ? 'Adding...' : 'Add Resource'}
        </button>
      </form>

      {/* Show success or error message */}
      {submitMessage && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          borderRadius: '5px',
          background: submitMessage.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: submitMessage.includes('successfully') ? '#155724' : '#721c24',
          border: `1px solid ${submitMessage.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {submitMessage}
        </div>
      )}
    </div>
  )
}

// Export the component so it can be used in other files
export default ResourceForm
