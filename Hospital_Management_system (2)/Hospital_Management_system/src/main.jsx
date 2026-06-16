import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : "https://noble-energy-production-e190.up.railway.app");

// Global fetch interceptor to inject JWT token automatically and rewrite localhost/relative backend URLs
const originalFetch = window.fetch;
window.fetch = async function (resource, init) {
  let resourceUrl = typeof resource === 'string' ? resource : (resource && resource.url);
  
  if (resourceUrl && (resourceUrl.startsWith('http://localhost:5000') || resourceUrl.startsWith('/'))) {
    // Re-route local requests to production URL if running in production
    if (resourceUrl.startsWith('http://localhost:5000')) {
      const path = resourceUrl.substring('http://localhost:5000'.length);
      resourceUrl = `${API_URL}${path}`;
      if (typeof resource === 'string') {
        resource = resourceUrl;
      } else if (resource && typeof resource === 'object') {
        resource = new Request(resourceUrl, resource);
      }
    } else if (resourceUrl.startsWith('/')) {
      resourceUrl = `${API_URL}${resourceUrl}`;
      if (typeof resource === 'string') {
        resource = resourceUrl;
      } else if (resource && typeof resource === 'object') {
        resource = new Request(resourceUrl, resource);
      }
    }

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
  
  // Handle session expiration or unauthorized request (except for login/registration endpoints)
  const isLoginRequest = resourceUrl && (resourceUrl.includes("/login") || resourceUrl.includes("/register-patient") || resourceUrl.includes("/public/doctors"));
  if ((response.status === 401 || response.status === 403) && !isLoginRequest) {
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

