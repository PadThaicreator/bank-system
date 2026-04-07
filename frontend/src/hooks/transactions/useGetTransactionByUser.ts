import { useCallback, useEffect, useState } from "react"
import type { TransactionDTO } from "../../types/transactionType"
import { transactionService } from "../../services/transactionService"

interface PageInfo {
    number: number
    totalPages: number
    totalElements: number
}

export function useGetTransactionByUser(initialPage: number = 0, initialSize: number = 10) {
    const [transactions, setTransactions] = useState<TransactionDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        number: 0,
        totalPages: 0,
        totalElements: 0,
    })

    const fetchTransactions = useCallback(async (page: number = initialPage, size: number = initialSize) => {
        setLoading(true)
        setError(null)
        try {
            const res = await transactionService.getTransactionByUser(page, size)
            const body = (res.data as any)?.data ?? res.data

            // backend returns ReturnDataClass ที่มี transactionList + pagination fields
            const list: TransactionDTO[] = body?.transactionList ?? []
            setTransactions(list)
            setPageInfo({
                number: body?.number ?? page,
                totalPages: body?.totalPages ?? 0,
                totalElements: body?.totalElements ?? list.length,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }, [initialPage, initialSize])

    useEffect(() => {
        fetchTransactions(initialPage, initialSize)
    }, [fetchTransactions, initialPage, initialSize])

    return { transactions, loading, error, pageInfo, refetch: fetchTransactions }
}

export default useGetTransactionByUser
