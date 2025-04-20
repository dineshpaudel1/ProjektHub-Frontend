
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Interceptor to handle auth failures globally
// instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const status = error?.response?.status;

//         if (!navigator.onLine || status === 401 || !error.response) {
//             // Clear localStorage if unauthorized or server offline
//             localStorage.removeItem("token");
//             localStorage.removeItem("refreshToken");
//             localStorage.removeItem("isAuthenticated");

//             // Force reload to login page
//             window.location.href = "/admin/login";
//         }

//         return Promise.reject(error);
//     }
// );

export default instance;
