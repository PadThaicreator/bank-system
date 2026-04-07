import { useState, useCallback, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import type { UserPage } from '../../services/adminService';

export const useUsersTree = (initialSearchTerm: string = '', initialPage: number = 0, size: number = 10) => {
    const [data, setData] = useState<UserPage | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
    const [page, setPage] = useState<number>(initialPage);

    const fetchTree = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getUsersTree(searchTerm, page, size);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, size]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTree();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, page, size, fetchTree]);

    return {
        data,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        page,
        setPage,
        refetch: fetchTree
    };
};
