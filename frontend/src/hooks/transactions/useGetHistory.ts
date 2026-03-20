import { useCallback, useEffect, useState } from "react"
import type { TransactionDTO } from "../../types/transactionType"
import { transactiontService } from "../../services/transactionService"



export function useHistoryTransaction (accountId: string | undefined) {
    const [transaction, setTransaction] = useState<TransactionDTO[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
 

    const fetchHistoryTransaction = useCallback(async (accountId : string) => {
        setLoading(true)
        setError(null)
        try{
            // console.log("ASDASD");
            const res = await transactiontService.getTransactionHistory(accountId)
            setTransaction(res.data as TransactionDTO[])
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
            fetchHistoryTransaction(accountId)
        } else {
            setTransaction(undefined)
            setLoading(false)
            setError(null)
        }
    } , [accountId, fetchHistoryTransaction])


    return { transaction, loading, error }
}

export default useHistoryTransaction