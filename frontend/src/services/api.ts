import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
let API_URL = rawApiUrl 
  ? (rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`) 
  : 'http://localhost:5000/api/v1';

// Render internal URL fix: If hostname doesn't have a dot and is not localhost, append .onrender.com
const urlObj = new URL(API_URL.startsWith('http') ? API_URL : `https://${API_URL}`);
if (!urlObj.hostname.includes('.') && urlObj.hostname !== 'localhost') {
  console.log('Detected internal Render hostname, appending .onrender.com');
  urlObj.hostname += '.onrender.com';
  API_URL = urlObj.toString();
}

// Force /api/v1 suffix if missing (essential for backend routes)
if (!API_URL.includes('/api/v1')) {
    API_URL = API_URL.endsWith('/') ? `${API_URL}api/v1` : `${API_URL}/api/v1`;
}

console.log('SwiftCart API URL Initialized:', API_URL);

const api = axios.create({
  baseURL: API_URL,
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
