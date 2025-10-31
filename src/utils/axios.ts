import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh token for these endpoints
    const noRefreshEndpoints = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];
    const isNoRefreshEndpoint = noRefreshEndpoints.some(endpoint =>
      originalRequest.url?.includes(endpoint)
    );

    // Only attempt refresh if:
    // 1. Response is 401
    // 2. We haven't already retried
    // 3. It's not a login/register/refresh endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isNoRefreshEndpoint
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await axiosInstance.post('/auth/refresh');
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;