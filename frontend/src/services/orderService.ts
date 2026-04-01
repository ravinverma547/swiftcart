import api from './api';

export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders/new', orderData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get('/orders/me');
  return data;
};

export const getOrderDetails = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const returnOrder = async (id: string, reason: string) => {
  const { data } = await api.put(`/orders/return/${id}`, { reason });
  return data;
};

export const cancelOrder = async (id: string, reason: string) => {
  const { data } = await api.put(`/orders/cancel/${id}`, { reason });
  return data;
};

export const getAllOrdersAdmin = async () => {
  const { data } = await api.get('/orders/admin/all');
  return data;
};

export const updateOrderStatusAdmin = async (id: string, orderStatus: string, note?: string) => {
  const { data } = await api.put(`/orders/admin/${id}`, { orderStatus, note });
  return data;
};
