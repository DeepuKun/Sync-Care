import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Global fetch interceptor to inject JWT token automatically
const originalFetch = window.fetch;
window.fetch = async function (resource, init) {
  const resourceUrl = typeof resource === 'string' ? resource : (resource && resource.url);
  
  if (resourceUrl && (resourceUrl.startsWith('http://localhost:5000') || resourceUrl.startsWith('/'))) {
    init = init || {};
    
    // Create headers container if not present
    if (!init.headers) {
      init.headers = {};
    }
    
    const token = localStorage.getItem("token");
    if (token) {
      if (init.headers instanceof Headers) {
        init.headers.set("Authorization", `Bearer ${token}`);
      } else if (Array.isArray(init.headers)) {
        const hasAuth = init.headers.some(([key]) => key.toLowerCase() === 'authorization');
        if (!hasAuth) {
          init.headers.push(["Authorization", `Bearer ${token}`]);
        }
      } else {
        if (!init.headers["Authorization"] && !init.headers["authorization"]) {
          init.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
  }
  
  const response = await originalFetch(resource, init);
  
  // Handle session expiration or unauthorized request (except for login endpoints)
  if ((response.status === 401 || response.status === 403) && resourceUrl && !resourceUrl.includes("/login")) {
    localStorage.clear();
    window.location.href = "/Login_choice";
  }
  
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)

