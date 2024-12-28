import { apiClient } from './api';

export const eventService = {
  getEvents: () => 
    apiClient.request('/api/events'),

  createEvent: (eventData) =>
    apiClient.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    }),

  updateEvent: (eventId, eventData) =>
    apiClient.request(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    }),

  deleteEvent: (eventId) =>
    apiClient.request(`/api/events/${eventId}`, {
      method: 'DELETE'
    })
};