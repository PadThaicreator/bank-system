import { useState, useCallback, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import type { OrderDTO } from '../../types/orderType';

export function useOrderManagement() {
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // pagination states
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchOrders = useCallback(async (page: number = 0, size: number = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderService.getAllOrders(page, size);
            const data: any = response.data?.data || response.data;
            if (data?.content) {
                setOrders(data.content as OrderDTO[]);
                setCurrentPage(data.currentPage || 0);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
            } else if (Array.isArray(data)) {
                setOrders(data as OrderDTO[]);
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleApproveOrder = useCallback(async (orderId: string, isApprove: boolean) => {
        setLoading(true);
        setError(null);
        try {
            await orderService.approveOrder(orderId, isApprove);
            await fetchOrders(currentPage);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to process order");
            setLoading(false);
            return false;
        }
    }, [currentPage, fetchOrders]);

    useEffect(() => {
        fetchOrders(0);
    }, [fetchOrders]);

    return { orders, loading, error, currentPage, totalPages, totalElements, fetchOrders, handleApproveOrder };
}

export default useOrderManagement;
