// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '',
    timeout: 10000,
    // 其他配置...
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        // const token = sessionStorage.getItem('token');
        if (token) {
            // config.headers['Authorization'] = `Bearer ${token}`;
            config.headers.token = `${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;