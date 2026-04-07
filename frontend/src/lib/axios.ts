import axios from "axios"
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

// ── Request interceptor: ใส่ JWT token ทุก request อัตโนมัติ
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ── Response interceptor: handle error globally
api.interceptors.response.use(
    (response: AxiosResponse) => response.data, // unwrap ApiResponse<T> ออกตรงนี้เลย
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");

                // Use axios directly to avoid interceptor loop
                const response = await axios.post(`${api.defaults.baseURL}/users/refreshToken`, { refreshToken });
                const { token, refreshToken: newRefreshToken } = response.data.data;

                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        if (status === 403) {
            console.error("Permission denied");
        }

        // ส่ง error message จาก ApiResponse ถ้ามี
        const message = error.response?.data?.message || error.message || "Something went wrong";

        return Promise.reject(new Error(message));
    }
)

export default api