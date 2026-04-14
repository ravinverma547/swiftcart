import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
let BASE_URL = rawApiUrl 
  ? (rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`) 
  : 'http://localhost:5000/api/v1';

// Fix Render internal hostnames
if (!BASE_URL.includes('.') && !BASE_URL.includes('localhost')) {
  BASE_URL = BASE_URL.replace(/(https?:\/\/)?([^\/]+)/, (match, proto, host) => {
    return `${proto || 'https://'}${host}.onrender.com`;
  });
}

// Ensure it ends with /api/v1 correctly without double slashes
BASE_URL = BASE_URL.replace(/\/$/, ""); // Remove trailing slash if any
if (!BASE_URL.includes('/api/v1')) {
    BASE_URL = `${BASE_URL}/api/v1`;
}

console.log('SwiftCart API URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getProducts = async (params: any) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductDetails = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export default api;
