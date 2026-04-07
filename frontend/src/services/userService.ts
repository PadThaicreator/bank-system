import api from '../lib/axios'
import type { UserDTO, UserModel } from '../types/userType';



const BASE = "/api/users";

export const userService = {
    
    
    getAllUser: (page: number = 0, size: number = 10) => api.get<UserDTO[]>(`${BASE}?page=${page}&size=${size}`),

    
    login: (data : LoginRequest) => api.post<LoginResponse>(`${BASE}/login` , data),

    
    register: (data: UserModel) => api.post<UserModel>(`${BASE}/register` , data),

    editUser: (data: UserDTO) => api.put<UserModel>(`${BASE}` , data),
}


interface LoginResponse {
    token : string;
    user : UserData
}

interface UserData {
    id : string;
    email : string;
    role : string;
    fullName : string;
    phone : string;
}

interface LoginRequest {
    email : string;
    password : string;
}

