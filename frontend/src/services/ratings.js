import api from './api';

export const createRating = async (ratingData) => {
  const response = await api.post('/ratings', ratingData);
  return response.data;
};

export const updateRating = async (id, ratingData) => {
  const response = await api.put(`/ratings/${id}`, ratingData);
  return response.data;
};

export const deleteRating = async (id) => {
  const response = await api.delete(`/ratings/${id}`);
  return response.data;
};
