import api from '../lib/axios';

export interface AdminDashboardStats {
    totalUsers: number;
    totalAccounts: number;
    todayTransactionCount: number;
    todayTransactionValue: number;
    suspendedUsers: number;
    suspendedAccounts: number;
}


export interface AccountData {
    id: string;
    accountNumber: string;
    accountType: string;
    accountCategory: string;
    balance: number;
    status: string;
}

export interface UserTree {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    accounts: AccountData[];
}

export interface UserPage {
    content: UserTree[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const adminService = {
    getDashboardStats: async (date: string): Promise<AdminDashboardStats> => {
        const query = `
            query($date: String!) {
                adminDashboardStats(date: $date) {
                    totalUsers
                    totalAccounts
                    todayTransactionCount
                    todayTransactionValue
                    suspendedUsers
                    suspendedAccounts
                }
            }
        `;
        
        try {
            const variables = { date };
            const response = await api.post('/api/graphql', { query, variables });
            
            const graphqlResponse = response as any;
            if (graphqlResponse.errors && graphqlResponse.errors.length > 0) {
                throw new Error(graphqlResponse.errors[0]?.message || 'GraphQL Error');
            }
            
            return graphqlResponse.data.adminDashboardStats;
        } catch (error) {
            console.error("GraphQL Error fetching Dashboard Stats:", error);
            throw error;
        }
    },

    getUsersTree: async (searchTerm: string, page: number, size: number): Promise<UserPage> => {
        const query = `
            query($searchTerm: String, $page: Int!, $size: Int!) {
                usersTree(searchTerm: $searchTerm, page: $page, size: $size) {
                    content {
                        id
                        fullName
                        email
                        role
                        status
                        createdAt
                        accounts {
                            id
                            accountNumber
                            accountType
                            accountCategory
                            balance
                            status
                        }
                    }
                    totalElements
                    totalPages
                    size
                    number
                }
            }
        `;
        
        try {
            const variables = { searchTerm, page, size };
            const response = await api.post('/api/graphql', { query, variables });
            
            const graphqlResponse = response as any;
            if (graphqlResponse.errors && graphqlResponse.errors.length > 0) {
                throw new Error(graphqlResponse.errors[0]?.message || 'GraphQL Error');
            }
            
            return graphqlResponse.data.usersTree;
        } catch (error) {
            console.error("GraphQL Error fetching Users Tree:", error);
            throw error;
        }
    }
};
