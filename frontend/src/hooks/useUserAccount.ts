import { useCallback, useEffect, useState } from "react"
import type { AccountResponse} from "../types/accountType"
import { accountService } from "../services/accountService"


export function useUserAccount(initialPage: number = 0, initialSize: number = 10) {
    const [accounts, setAccounts] = useState<AccountResponse[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0, totalElements: 0 })

    const fetchUserAccount = useCallback(async (page: number = initialPage, size: number = initialSize) => {
        setLoading(true)
        setError(null)
        try{
            const res = await accountService.getUserAccount(page, size)
            // Handle both unwrapped and wrapped api schemas implicitly
            const data = (res.data as any).data || res.data;
            const content = Array.isArray(data) ? data : (data.content || []);
            setAccounts(content as AccountResponse[])
            if (!Array.isArray(data)) {
                 setPageInfo({ number: data.number || 0, totalPages: data.totalPages || 0, totalElements: data.totalElements || 0 })
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [initialPage, initialSize])


    useEffect(() => {
        fetchUserAccount(initialPage, initialSize)
    }, [fetchUserAccount, initialPage, initialSize])


    return { accounts, loading, error, fetchUserAccount, pageInfo }
}

export default useUserAccount