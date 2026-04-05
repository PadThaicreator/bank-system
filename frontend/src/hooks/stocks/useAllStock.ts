import { useCallback, useEffect, useState } from "react"
import { stockService } from "../../services/stockService"
import type { StockListDTO } from "../../types/stockType"

export function useAllStock(page: number = 0, size: number = 10) {
    const [stocks, setStocks] = useState<StockListDTO>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStocks = useCallback(async (p: number, s: number) => {
        setLoading(true)
        setError(null)
        try {
            const res = await stockService.getAllStocks(p, s)
            const rawRes: any = res;
            console.log("Stock API Response:", rawRes);
            
            let finalStocks: any = { content: [], totalPages: 1, totalElements: 0 };

            // The data might be inside rawRes itself, or rawRes.data
             const dataObj = rawRes?.data ? rawRes.data : rawRes;

            // If the backend returns a flat array
            if (Array.isArray(dataObj)) {
                finalStocks.content = dataObj;
            } else if (dataObj) {
                // If the backend returns pagination wrapper
                finalStocks = { ...dataObj };
                if (dataObj.content) {
                    finalStocks.content = dataObj.content;
                } else if (dataObj.stockList) {
                    finalStocks.content = dataObj.stockList;
                } else if (dataObj.data && Array.isArray(dataObj.data)) {
                     finalStocks.content = dataObj.data;
                }
            }
            // Ensure content is always an array
            finalStocks.content = Array.isArray(finalStocks.content) ? finalStocks.content : [];
            
            setStocks(finalStocks);

        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to fetch stocks")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStocks(page, size)
    }, [page, size, fetchStocks])

    return { stocks, loading, error, fetchStocks }
}

export default useAllStock;
