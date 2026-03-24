import { useCallback, useState } from "react"
import type { TransactionDTO } from "../../types/transactionType"
import { transactiontService } from "../../services/transactionService"
import { isAxiosError } from "axios"



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
            return res.data;
        }
        catch (err) {
            if (isAxiosError(err) && err.response?.data) {
                const errData = err.response.data;
                const errorMessage = errData.error?.details || errData.message || err.message;
                setError(errorMessage);
            } else {
                setError(err instanceof Error ? err.message : String(err));
            }
            throw err;
        }
        finally{
            setLoading(false)
        }
    }, [])


    return { transaction, loading, error, postTransaction }
}

export default useTransaction