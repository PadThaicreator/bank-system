import api from '../lib/axios'
import type { PaginatedRequestResponse } from '../types/requestType';



const BASE = "/api/requests";


export const requestService = {

    // Get /api/accounts
    getAllRequest: (page: number = 0, size: number = 5) => api.get<PaginatedRequestResponse>(`${BASE}`, { params: { page, size } }),

    approveRequest : (reqId : string , isApprove : boolean) => api.put(`${BASE}/${reqId}?isApprove=${isApprove}`),

    // getTransactionHistory: (fromAccId: string, page: number = 0, size: number = 10) => api.get<PaginatedTransactionResponse>(`${BASE}/history/${fromAccId}`, { params: { page, size } }),

    // postTransaction: (data: TransactionDTO) => api.post<TransactionDTO>(BASE, data),

   
}