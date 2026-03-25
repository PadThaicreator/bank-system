import api from '../lib/axios'
import type { PaginatedUserResponse, UserDTO, UserModel } from '../types/userType';



const BASE = "/api/users";

export const userService = {
    
    
    getAllUser: (page : number , size : number) => api.get<PaginatedUserResponse>(`${BASE}?page=${page}&size=${size}`),

    
    login: (data : LoginRequest) => api.post<LoginResponse>(`${BASE}/login` , data),

    
    register: (data: UserModel) => api.post<UserModel>(`${BASE}/register` , data),

    editUser : (data : UserDTO) => api.put<UserDTO>(`${BASE}` , data),
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

