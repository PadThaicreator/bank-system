import api from "../lib/axios";

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface User {
    fullName: string;
    email: string;
    role: string;
    userId: string;
    birthDate?: string;
    gender?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    passwordHash: string;
    phone: string;
    role: "CUSTOMER" | "ADMIN";
    birthDate: string;
    gender: string;
}

export interface UpdateProfileRequest {
    fullName: string;
    phone: string;
    birthDate?: string;
    gender?: string;
}

const BASE = "/api/users";

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post(`${BASE}/login`, data);
        return response as unknown as LoginResponse;
    },
    register: async (data: RegisterRequest) => {
        return await api.post(`${BASE}/register`, data);
    },
    getProfile: async (): Promise<{ success: boolean; data: User }> => {
        return await api.get(`${BASE}/me`);
    },
    updateProfile: async (data: UpdateProfileRequest): Promise<{ success: boolean; data: User }> => {
        return await api.put(`${BASE}/me`, data);
    }
};
