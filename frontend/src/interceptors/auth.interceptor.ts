import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/users/refresh-token/')
        ) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post('/users/refresh-token/', {},{withCredentials: true});
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
