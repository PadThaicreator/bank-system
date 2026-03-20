import api from '../lib/axios'
import type { AccountResponse, BalanceResponse, CreateAccountRequest } from '../types';

const BASE = "/api/accounts";

export const accountService = {

    // Get /api/accounts
    getAllAccounts: () => api.get<AccountResponse[]>(BASE),

    // Get /api/accounts/{accountId}
    getAccountById: (accountId: string) => api.get<AccountResponse>(`${BASE}/${accountId}`),

    // Get /api/accounts/{accountId}
    getBalanceById: (accountId: string) => api.get<BalanceResponse>(`${BASE}/${accountId}/getAccountBalance`),

    // Post /api/accounts
    createAccount: (data: CreateAccountRequest) => api.post<AccountResponse>(BASE, data),

    // Patch /api/accounts/{accountId}/changeBalance?amount={amount}
    addBalanceToAccount: (accountId: string, amount: number) => api.patch<AccountResponse>(`${BASE}/${accountId}/changeBalance?amount=${amount}`),

    // Patch /api/account/{accountId}/deleteAcount
    deleteAccount: (accountId: string) => api.patch<AccountResponse>(`${BASE}/${accountId}/deleteAccount`),
}