import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClientInstance = axios.create({
  baseURL: API_URL,
});

apiClientInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string, params = {}) => apiClientInstance.get<T>(url, { params }).then(res => res.data),
  post: <T>(url: string, data: any) => apiClientInstance.post<T>(url, data).then(res => res.data),
  put: <T>(url: string, data: any) => apiClientInstance.put<T>(url, data).then(res => res.data),
  patch: <T>(url: string, data: any) => apiClientInstance.patch<T>(url, data).then(res => res.data),
  delete: <T>(url: string) => apiClientInstance.delete<T>(url).then(res => res.data),
};