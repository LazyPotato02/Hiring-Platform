import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // ⚠️ Сложи _retry проверка и изключи refresh самия endpoint
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/users/refresh-token/')
        ) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post('/users/refresh-token/');
                return axiosInstance(originalRequest); // Retry оригиналната заявка
            } catch (refreshError) {
                // ✅ ВАЖНО: Никакво redirect-ване тук, ако вече си на /login
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
