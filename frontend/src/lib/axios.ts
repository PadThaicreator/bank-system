import axios from "axios"
import type { AxiosResponse /*, InternalAxiosRequestConfig*/ } from "axios"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json"
    }
})

// ── Request interceptor: ใส่ JWT token ทุก request อัตโนมัติ
// api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const token = localStorage.getItem("token")
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config
//     },
//     (error) => Promise.reject(error)
// )

// ── Response interceptor: handle error globally
api.interceptors.response.use(
    (response: AxiosResponse) => response.data, // unwrap ApiResponse<T> ออกตรงนี้เลย
    (error) => {
        const status = error.response?.status

        if (status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/login"
        }

        if (status === 403) {
            console.error("Permission denied")
        }

        // ส่ง error message จาก ApiResponse ถ้ามี
        const message = error.response?.data?.message || error.message || "Something went wrong"

        return Promise.reject(new Error(message))
    }
)

export default api