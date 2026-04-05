import { useState } from "react"
import { requestService } from "../../services/requestService"
import type { PortfolioDTO } from "../../types/portfolioType"

export function usePostPortfolioRequest() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const postPortfolioRequest = async (portfolioData: PortfolioDTO) => {
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            const res = await requestService.postPortfolioRequest(portfolioData)
            setSuccess(true)
            return res.data
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to submit request")
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { postPortfolioRequest, loading, error, success }
}

export default usePostPortfolioRequest;
