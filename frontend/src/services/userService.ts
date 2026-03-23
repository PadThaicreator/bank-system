import api from '../lib/axios'
import type { UserDTO, UserModel } from '../types/userType';



const BASE = "/api/users";

export const userService = {
    
    
    getAllUser: () => api.get<UserDTO[]>(`${BASE}/getAllUser`),

    
    login: (data : LoginRequest) => api.post<LoginResponse>(`${BASE}/login` , data),

    
    register: (data: UserModel) => api.post<UserModel>(`${BASE}/register` , data),

   
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

