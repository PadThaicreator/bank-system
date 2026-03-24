import { useCallback, useEffect, useState } from "react"
import type { TransactionDTO } from "../../types/transactionType"
import { transactiontService } from "../../services/transactionService"

export function useHistoryTransaction (accountId: string | undefined, page: number = 0, size: number = 10) {
    const [transaction, setTransaction] = useState<TransactionDTO[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [totalElements, setTotalElements] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)

    const fetchHistoryTransaction = useCallback(async (accountId : string, pageNum: number, pageSize: number) => {
        setLoading(true)
        setError(null)
        try{
            
            const res = await transactiontService.getTransactionHistory(accountId, pageNum, pageSize)
           
            const actualResponse = res as unknown as import("../../types/transactionType").PaginatedTransactionResponse;
            const data = actualResponse.data;
            if (data) {
                // Try to get transactions from content, transactionList, or assume data is an array
                const txList = data.content || data.transactionList;
                if (Array.isArray(txList)) {
                    setTransaction(txList as TransactionDTO[]);
                } else if (Array.isArray(data)) {
                    setTransaction(data as TransactionDTO[]);
                } else {
                    setTransaction([]);
                }
                
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
                setCurrentPage(data.currentPage ?? pageNum);
            } else {
                setTransaction([]);
                setTotalPages(0);
                setTotalElements(0);
            }
            console.log(res);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (accountId) {
            fetchHistoryTransaction(accountId, page, size)
        } else {
            setTransaction(undefined)
            setLoading(false)
            setError(null)
            setTotalPages(0)
            setTotalElements(0)
            setCurrentPage(0)
        }
    } , [accountId, page, size, fetchHistoryTransaction])

    return { transaction, loading, error, totalPages, totalElements, currentPage, fetchHistoryTransaction }
}

export default useHistoryTransaction