import { useCallback, useState } from "react"
import type { TransactionDTO } from "../../types/transactionType"
import { transactiontService } from "../../services/transactionService"



export function useTransaction () {
    const [transaction, setTransaction] = useState<TransactionDTO | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
 

    const postTransaction = useCallback(async (data : TransactionDTO) => {
        setLoading(true)
        setError(null)
        try{
            const res = await transactiontService.postTransaction(data)
            setTransaction(res.data as TransactionDTO)
            console.log(res);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])


    return { transaction, loading, error, postTransaction }
}

export default useTransaction