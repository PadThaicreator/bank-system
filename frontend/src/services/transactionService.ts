import api from '../lib/axios'

import type { ApiResponseReturnDataClass, TransactionDTO } from '../types/transactionType';

const BASE = "/api/transactions";


export const transactionService = {

    // Get /api/transactions
    getAllTransaction: () => api.get<TransactionDTO[]>(BASE),

    // Get /api/transactions/history/{accNum}?page=&size=
    getTransactionHistory: (fromAccId: string) => api.get<TransactionDTO>(`${BASE}/getHistory/${fromAccId}`),

    // Get /api/transactions/user?page=&size=
    getTransactionByUser: (page: number = 0, size: number = 10) =>
        api.get<ApiResponseReturnDataClass>(`${BASE}/user?page=${page}&size=${size}`),

    // Post /api/transactions
    postTransaction: (data: TransactionDTO) => api.post<TransactionDTO>(BASE, data),

}