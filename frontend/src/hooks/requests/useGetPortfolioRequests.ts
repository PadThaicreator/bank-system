import { useCallback, useState } from "react"
import { requestService } from "../../services/requestService"
import type { RequestDTO } from "../../types/requestType"

export function useGetPortfolioRequests() {
    const [requestList, setRequestList] = useState<RequestDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalElements, setTotalElements] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)

    const fetchAllRequest = useCallback(async (page: number = 0, size: number = 10, status: string = "") => {
        setLoading(true)
        setError(null)
        try {
            const res = await requestService.getAllPortfolioRequest(page, size, status)
            // Bulletproof unwrapping
            const rawRes: any = res;
            const dataObj = rawRes?.data ? rawRes.data : rawRes;
            
            let contentList: RequestDTO[] = [];
            
            if (Array.isArray(dataObj)) {
                contentList = dataObj;
            } else if (dataObj) {
                if (dataObj.content) {
                    contentList = dataObj.content;
                } else if (dataObj.requestList) {
                    contentList = dataObj.requestList;
                } else if (dataObj.data && Array.isArray(dataObj.data)) {
                    contentList = dataObj.data;
                }
                setTotalPages(dataObj.totalPages || 1);
                setTotalElements(dataObj.totalElements || 0);
            }
            
            contentList = Array.isArray(contentList) ? contentList : [];
            
            setRequestList(contentList)
            setCurrentPage(page)
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to fetch portfolio requests")
        } finally {
            setLoading(false)
        }
    }, [])

    return { requestList, loading, error, fetchAllRequest, totalPages, totalElements, currentPage }
}

export default useGetPortfolioRequests;
