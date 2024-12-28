import { API_BASE_URL } from '../config/constants';

export const authService = {
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Not authenticated');
      return await response.json();
    } catch (error) {
      console.error('Auth error:', error);
      return null;
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    window.location.href = '/';
  }
};