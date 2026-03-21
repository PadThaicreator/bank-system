import { useCallback, useEffect, useState } from "react"
import type { AccountResponse } from "../types"
import { accountService } from "../services/accountService"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"


export function  useUserAccount () {
    const [accounts, setAccounts] = useState<AccountResponse[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
      const user = useSelector((state: RootState) => state.auth); 

    const fetchUserAccount = useCallback(async () => {
        setLoading(true)
        setError(null)
        try{
            console.log(user.user?.userId);
            const res = await accountService.getUserAccount(user.user?.userId || "")
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


    return { accounts, loading, error }
}

export default useUserAccount