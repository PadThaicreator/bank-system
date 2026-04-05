import api from '../lib/axios'
import type { PortfolioDTO } from '../types/portfolioType';
import type { PaginatedRequestResponse } from '../types/requestType';



const BASE = "/api/requests";


export const requestService = {

    // Get /api/accounts
    getAllRequest: (page: number = 0, size: number = 5) => api.get<PaginatedRequestResponse>(`${BASE}`, { params: { page, size } }),

    approveRequest : (reqId : string , isApprove : boolean) => api.put(`${BASE}/${reqId}?isApprove=${isApprove}`),

    getAllPortfolioRequest: (page: number = 0, size: number = 10 ,  status : string) => api.get<PaginatedRequestResponse>(`${BASE}/portfolio`, { params: { page, size , status } }),

    approvePortfolioRequest : (reqId : string , isApprove : boolean) => api.put(`${BASE}/portfolio/${reqId}?isApprove=${isApprove}`),

    postPortfolioRequest : (portfolio : PortfolioDTO) => api.post(`${BASE}/portfolio`, portfolio ),

}