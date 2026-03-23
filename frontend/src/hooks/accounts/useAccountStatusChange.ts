import { useCallback, useState } from "react"
import { accountService } from "../../services/accountService"

export function useAccountStatusChange () {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const changeStatus = useCallback(async (accountId: string, status: string) => {
        setLoading(true)
        setError(null)
        try{
            const res = await accountService.changeAccountStatus(accountId, status)
            return res.data
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])

    return { changeStatus, loading, error }
}

export default useAccountStatusChange