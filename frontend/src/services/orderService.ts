import api from '../lib/axios'
import type { PaginatedOrderResponse, OrderDTO } from '../types/orderType';



const BASE = "/api/orders";


export const orderService = {

    
    getAllOrders: (page: number = 0, size: number = 10) => api.get<PaginatedOrderResponse>(`${BASE}`, { params: { page, size } }),

    approveOrder : (orderId : string , isApprove : boolean) => api.put(`${BASE}/${orderId}?isApprove=${isApprove}`),

    createOrder : (order : OrderDTO) => api.post(`${BASE}`, order),

}