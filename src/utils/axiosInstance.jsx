import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// ✅ Automatically attach token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // Define routes that should skip auth
        const isPublicEndpoint =
            config.url?.startsWith('/public') ||
            config.url?.includes('/media/photo') ||
            config.url?.includes('/auth') ||
            config.url?.includes('/search') ||
            config.url?.includes('/register') ||
            config.method === 'get' && config.url?.includes('/projects');

        if (token && !isPublicEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


export default instance;
