import { useCallback, useEffect, useState } from "react"
import { portfolioService } from "../../services/portfolioService"
import type { PortfolioDTO } from "../../types/portfolioType"

export function useMyPortfolio() {
    const [portfolios, setPortfolios] = useState<PortfolioDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPortfolios = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await portfolioService.getMyPortfolio()
            // At runtime, interceptor unwraps AxiosResponse.
            // res is ApiResponse... which has .data
            // .data could be an array OR ReturnDataClassPortfolioDTO which has .content
            let parsedData = Array.isArray(res) ? res : [];
            if ((res as any)?.data) {
                if (Array.isArray((res as any).data)) {
                    parsedData = (res as any).data;
                } else if (Array.isArray((res as any).data.content)) {
                    parsedData = (res as any).data.content;
                }
            }
            setPortfolios(parsedData || [])
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to fetch portfolios")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPortfolios()
    }, [fetchPortfolios])

    return { portfolios, loading, error, fetchPortfolios }
}

export default useMyPortfolio;
