import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
