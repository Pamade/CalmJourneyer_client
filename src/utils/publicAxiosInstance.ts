import axios from 'axios';

// Public axios instance for endpoints that work for both logged and guest users
export const publicAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Important: sends cookies (including guest_id)
    headers: {
        'Content-Type': 'application/json',
    },
});

// No interceptors - this allows requests to work without authentication
export default publicAxiosInstance;