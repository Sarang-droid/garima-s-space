// API configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://garima-s-space-backend.vercel.app/api';

// Make it globally available for older scripts
window.API_BASE_URL = API_BASE_URL;

// Export the configuration
export { API_BASE_URL };
