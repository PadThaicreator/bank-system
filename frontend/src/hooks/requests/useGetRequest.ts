import { useCallback, useEffect, useState } from "react"
import type { PaginatedRequestResponse, RequestDTO } from "../../types/requestType"
import { requestService } from "../../services/requestService"

export function useGetAllRequest (page: number = 0, size: number = 10) {
    const [requestList, setRequestList] = useState<RequestDTO[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [totalElements, setTotalElements] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)

    const fetchAllRequest = useCallback(async (pageNum: number, pageSize: number) => {
        setLoading(true)
        setError(null)
        try{
            
            const res = await requestService.getAllRequest(pageNum, pageSize)
            const responseData = res as unknown as PaginatedRequestResponse;
           
            
            const data  = responseData.data;
            
            if (data) {
                const requestList = data.content ;
                if (Array.isArray(requestList)) {
                    setRequestList(requestList);
                  
                }else {
                    setRequestList([]);
                }
                
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
                setCurrentPage(data.currentPage ?? pageNum);
            } else {
                setRequestList([]);
                setTotalPages(0);
                setTotalElements(0);
            }
            console.log(requestList)
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])

    useEffect(() => {
      
            fetchAllRequest( page, size)
      
    } , [page, size, fetchAllRequest])

    return { requestList, loading, error, totalPages, totalElements, currentPage, fetchAllRequest }
}

export default useGetAllRequest