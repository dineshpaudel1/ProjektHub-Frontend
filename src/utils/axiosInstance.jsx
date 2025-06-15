import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Attach access token to every request
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Auto refresh access token if expired
instance.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;

        if (originalRequest.url.includes('/auth/refresh')) {
            return Promise.reject(err);
        }

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token found.");

                // 🔥 REMOVE Authorization header here
                const refreshRes = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`,
                    { refreshToken: refreshToken },
                    { withCredentials: true }
                );

                const newAccessToken = refreshRes.data.data.accessToken;
                localStorage.setItem("token", newAccessToken);

                // ✅ RETRY ORIGINAL REQUEST PROPERLY
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return instance(originalRequest);

            } catch (refreshErr) {
                console.error("Refresh token failed:", refreshErr);
                localStorage.clear();
                const isAdmin = window.location.pathname.startsWith("/admin");
                const redirectPath = isAdmin ? "/admin/login" : "/login";
                window.location.href = redirectPath;
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(err);
    }
);

export default instance;
