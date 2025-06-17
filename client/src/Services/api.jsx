import axios from 'axios';

export const BASEURL = "http://localhost:5000/api"  

const api = axios.create({
  baseURL: BASEURL, // ✅ Correct usage without {}
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Example: Auto Add Auth Token if exists (Optional)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or from context/state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
