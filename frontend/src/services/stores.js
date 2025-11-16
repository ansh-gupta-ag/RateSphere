import api from './api';

export const getStores = async (params = {}) => {
  const response = await api.get('/stores', { params });
  return response.data;
};

export const getStoreById = async (id) => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

export const createStore = async (storeData) => {
  const response = await api.post('/stores', storeData);
  return response.data;
};

export const updateStore = async (id, storeData) => {
  const response = await api.put(`/stores/${id}`, storeData);
  return response.data;
};

export const deleteStore = async (id) => {
  const response = await api.delete(`/stores/${id}`);
  return response.data;
};

export const getStoreRaters = async (id) => {
  const response = await api.get(`/stores/${id}/raters`);
  return response.data;
};
