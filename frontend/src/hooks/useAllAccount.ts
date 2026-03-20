import { useCallback, useEffect, useState } from "react"
import { accountService } from "../services/accountService"
import type { AccountResponse } from "../types"

export function useAllAccount () {
    const [accounts, setAccounts] = useState<AccountResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAccount = useCallback(async () => {
        setLoading(true)
        setError(null)
        try{
            const res = await accountService.getAllAccounts()
            setAccounts(res.data)
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAccount()
    } , [])


    return { accounts, loading, error, refetch: fetchAccount }
}

export default useAllAccount