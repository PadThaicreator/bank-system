import api from '../lib/axios'

import type { PaginatedTransactionResponse, TransactionDTO } from '../types/transactionType';

const BASE = "/api/transactions";


export const transactiontService = {

    // Get /api/accounts
    getAllTransaction: () => api.get<PaginatedTransactionResponse>(`${BASE}`),

   

    getTransactionHistory: (fromAccId: string, page: number = 0, size: number = 10) => api.get<PaginatedTransactionResponse>(`${BASE}/history/${fromAccId}`, { params: { page, size } }),

    postTransaction: (data: TransactionDTO) => api.post<TransactionDTO>(BASE, data),

   
}