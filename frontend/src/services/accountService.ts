import api from '../lib/axios'
import type { AccountResponse, BalanceResponse, CreateAccountRequest } from '../types/accountType';


const BASE = "/api/accounts";

export const accountService = {

    // Get /api/accounts
    getAllAccounts: () => api.get<AccountResponse[]>(BASE),

    // Get /api/accounts/{accountId}
    getAccountById: (accountId: string) => api.get<AccountResponse>(`${BASE}/${accountId}`),

    // Get /api/accounts/{accountId}/balance
    getBalanceById: (accountId: string) => api.get<BalanceResponse>(`${BASE}/${accountId}/balance`),

    // Get /api/accounts/user
    getUserAccount: () => api.get<AccountResponse[]>(`${BASE}/user`),

    // Post /api/accounts
    createAccount: (data: CreateAccountRequest) => api.post<AccountResponse>(BASE, data),

    // Patch /api/accounts/{accountId}/balance?amount={amount}
    addBalanceToAccount: (accountId: string, amount: number) => api.patch<AccountResponse>(`${BASE}/${accountId}/balance?amount=${amount}`),
    
    // Patch /api/accounts/{accountId}/status
    changeAccountStatus: (accountId: string, status: string) => api.patch<AccountResponse>(`${BASE}/${accountId}/status`, {"status": status}),
    
    // Patch /api/accounts/{accountId}/type
    changeAccountType: (accountId: string, accountType: string) => api.patch<AccountResponse>(`${BASE}/${accountId}/type`, {"accountType": accountType}),

    // Delete /api/accounts/{accountId}
    deleteAccount: (accountId: string) => api.delete<AccountResponse>(`${BASE}/${accountId}`),

}