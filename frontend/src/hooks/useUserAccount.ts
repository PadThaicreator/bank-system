import { useCallback, useEffect, useState } from "react"
import type { AccountResponse } from "../types/accountType"
import { accountService } from "../services/accountService"


export function  useUserAccount () {
    const [accounts, setAccounts] = useState<AccountResponse[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchUserAccount = useCallback(async () => {
        setLoading(true)
        setError(null)
        try{
            const res = await accountService.getUserAccount()
            setAccounts(res.data as AccountResponse[])
            // console.log(res);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        fetchUserAccount()
    } , [])


    return { accounts, loading, error, fetchUserAccount }
}

export default useUserAccount