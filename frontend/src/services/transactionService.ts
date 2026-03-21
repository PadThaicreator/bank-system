import api from '../lib/axios'

import type { TransactionDTO } from '../types/transactionType';

const BASE = "/api/transactions";


export const transactiontService = {

    // Get /api/accounts
    getAllTransaction: () => api.get<TransactionDTO[]>(BASE),

   

    getTransactionHistory:(fromAccId : string) => api.get<TransactionDTO>(`${BASE}/getHistory/${fromAccId}`),

    postTransaction: (data: TransactionDTO) => api.post<TransactionDTO>(BASE, data),

   
}