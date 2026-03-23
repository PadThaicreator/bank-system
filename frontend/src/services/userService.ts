import api from '../lib/axios'
import type { UserDTO } from '../types/userType';



const BASE = "/api/users";

export const accountService = {
    
    
    getAllUser: () => api.get<UserDTO[]>(BASE),

    
    login: (accountId: string) => api.get<LoginResponse>(`${BASE}/${accountId}`),

    
    //register: (accountId: string) => api.get<BalanceResponse>(`${BASE}/${accountId}/getAccountBalance`),

   
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

