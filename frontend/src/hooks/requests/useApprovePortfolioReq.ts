import { useState } from "react"
import { requestService } from "../../services/requestService"

export function useApprovePortfolioReq() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const approveRequest = async (reqId: string, isApprove: boolean) => {
        setLoading(true)
        setError(null)
        try {
            await requestService.approvePortfolioRequest(reqId, isApprove)
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to process approval")
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { approveRequest, loading, error }
}

export default useApprovePortfolioReq;
