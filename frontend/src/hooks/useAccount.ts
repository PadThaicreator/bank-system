import { useCallback, useEffect, useState } from "react"
import { accountService } from "../services/accountService"
import type { AccountResponse } from "../types"

export function  useAccount (accountId: string) {
    const [account, setAccount] = useState<AccountResponse>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAccount = useCallback(async (accountId: string) => {
        setLoading(true)
        setError(null)
        try{
            const res = await accountService.getAccountById(accountId)
            setAccount(res.data)
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAccount(accountId)
    } , [])


    return { account, loading, error }
}

export default useAccount