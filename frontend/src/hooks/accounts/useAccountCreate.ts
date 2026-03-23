import { useCallback, useState } from "react"
import { accountService } from "../../services/accountService"
import type { CreateAccountRequest } from "../../types/accountType"

export function useAccountCreate() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const createAccount = useCallback(async (accountData: CreateAccountRequest) => {
        setLoading(true)
        setError(null)
        try{
            const res = await accountService.createAccount(accountData)
            return res.data
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])

    return { createAccount, loading, error }
}