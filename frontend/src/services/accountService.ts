import api from '../lib/axios'
import type { AccountResponse, BalanceResponse, CreateAccountRequest, UserAccountResponse } from '../types/accountType';
import type { PageResponse } from '../types/pageType';


const BASE = "/api/accounts";

export const accountService = {

    // Get /api/accounts
    getAllAccounts: () => api.get<AccountResponse[]>(BASE),

    // Get /api/accounts/admin
    getAccountsPaginated: (page: number, size: number) => 
        api.get<PageResponse<AccountResponse>>(`${BASE}/admin?page=${page}&size=${size}`),

    // Get /api/accounts/{accountId}
    getAccountById: (accountId: string) => api.get<AccountResponse>(`${BASE}/${accountId}`),

    // Get /api/accounts/{accountId}/balance
    getBalanceById: (accountId: string) => api.get<BalanceResponse>(`${BASE}/${accountId}/balance`),

    // Get /api/accounts/user
    getUserAccount: (page: number = 0, size: number = 10) => 
        api.get<PageResponse<UserAccountResponse>>(`${BASE}/user?page=${page}&size=${size}`),

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