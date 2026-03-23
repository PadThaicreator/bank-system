import { useCallback, useState } from "react"
import { accountService } from "../../services/accountService"

export function useAccountTypeChange () {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const changeAccountType = useCallback(async (accountId: string, type: string) => {
        setLoading(true)
        setError(null)
        try{
            const res = await accountService.changeAccountType(accountId, type)
            return res.data
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])

    return { changeAccountType, loading, error }
}

export default useAccountTypeChange