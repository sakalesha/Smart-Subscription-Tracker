// Utility functions for localStorage management
export const clearAuthData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Auth data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    clearAuthData();
    return null;
  }
};

export const getStoredToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};
