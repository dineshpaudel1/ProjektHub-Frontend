import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Attach access token to every request
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// // Auto refresh access token if expired
// instance.interceptors.response.use(
//     res => res,
//     async err => {
//         const originalRequest = err.config;

//         // Only handle if it's a 401 (unauthorized) and hasn't been retried yet
//         if (err.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const refreshToken = localStorage.getItem('refreshToken');
//                 console.log(refreshToken);
//                 const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
//                     refreshToken: refreshToken
//                 });

//                 const newAccessToken = res.data.accessToken;
//                 localStorage.setItem("token", newAccessToken);

//                 // Retry original request with new access token
//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return instance(originalRequest);

//             } catch (refreshErr) {
//                 // 🛑 Refresh token failed — force logout and redirect

//                 localStorage.clear();

//                 const isAdmin = window.location.pathname.startsWith("/admin");
//                 const redirectPath = isAdmin ? "/admin/login" : "/login";

//                 window.location.href = redirectPath;

//                 return Promise.reject(refreshErr);
//             }
//         }

//         return Promise.reject(err);
//     }
// );

export default instance;
