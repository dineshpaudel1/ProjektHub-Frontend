import axios from 'axios';

// ✅ 1️⃣ Public instance — for all public routes (no token required)
export const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// ✅ 2️⃣ Protected instance — for authenticated routes
export const protectedApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// ✅ Attach access token automatically to protected requests
protectedApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// ✅ Handle automatic refresh token logic
protectedApi.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;

        // Prevent infinite loop
        if (originalRequest.url.includes('/auth/refresh')) {
            return Promise.reject(err);
        }

        // Handle only if token expired
        if (err.response?.data?.message === "Access token has expired" && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token found.");

                // 🔥 Use publicApi for refresh to avoid nested interceptors
                const refreshRes = await publicApi.post("/auth/refresh", { refreshToken });

                const newAccessToken = refreshRes.data?.data?.accessToken;
                if (!newAccessToken) throw new Error("No access token returned.");

                // ✅ Save new token
                localStorage.setItem("token", newAccessToken);

                // ✅ Attach new token to failed request and retry
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return protectedApi(originalRequest);

            } catch (refreshErr) {
                console.error("Refresh token failed:", refreshErr);
                handleLogoutAndRedirect();
                return Promise.reject(refreshErr);
            }
        }
        if (err.response?.status === 401) {
            handleLogoutAndRedirect();
        }

        return Promise.reject(err);
    }
);

// ✅ Central logout + redirect function
function handleLogoutAndRedirect() {
    localStorage.clear();
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
        window.location.href = "/admin/login";
    } else if (path.startsWith("/seller")) {
        window.location.href = "/seller/login";
    } else {
        window.location.href = "/login";
    }
}
