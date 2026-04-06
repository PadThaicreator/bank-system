import api from '../lib/axios';

export interface AdminDashboardStats {
    totalUsers: number;
    totalAccounts: number;
    todayTransactionCount: number;
    todayTransactionValue: number;
    suspendedUsers: number;
    suspendedAccounts: number;
}

interface GraphQLResponse<T> {
    data: T;
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
            
            // The response itself is the data body. For GraphQL, data lives inside response.data
            // depending on how the interceptor handles non-ApiResponse wrappers. 
            // If the interceptor unwrap is just `response.data`, then graphQL's payload is here:
            const graphqlResponse = response as unknown as GraphQLResponse<{ adminDashboardStats: AdminDashboardStats }>;
            
            if ((graphqlResponse as any).errors) {
                throw new Error((graphqlResponse as any).errors[0]?.message || 'GraphQL Error');
            }
            
            // Sometimes the axios unwrap in the interceptor might leave it as response.data.data
            const actualData = (graphqlResponse as any).data || graphqlResponse;
            return response.data.data.adminDashboardStats;
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
            return response.data.data.usersTree;
        } catch (error) {
            console.error("GraphQL Error fetching Users Tree:", error);
            throw error;
        }
    }
};
