import { useCallback, useEffect, useState } from "react"
import { stockService } from "../../services/stockService"
import type { StockPriceDTO } from "../../types/stockType"

export function useStockPrice(symbol: string) {
    const [priceData, setPriceData] = useState<StockPriceDTO | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPrice = useCallback(async (sym: string) => {
        setLoading(true)
        setError(null)
        try {
            const res = await stockService.getStockPrice(sym)
            setPriceData(res.data || null)
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to fetch stock price")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (symbol) {
            fetchPrice(symbol)
        }
    }, [symbol, fetchPrice])

    return { priceData, loading, error, fetchPrice }
}

export default useStockPrice;
