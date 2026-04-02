import { useCallback, useState } from "react"

import type { UserDTO } from "../../types/userType"
import { userService } from "../../services/userService";



export function useGetAllUser () {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0, currentPage: 0 })
 

    const getAllUser = useCallback(async (page: number = 0, size: number = 10) => {
        setLoading(true)
        setError(null)
        try{
            const res = await userService.getAllUser(page, size);
            const body = (res as any).data || res;
            setUsers(body?.userList || [])
            setPageInfo({
                totalPages: body?.totalPages || 0,
                totalElements: body?.totalElements || 0,
                currentPage: body?.currentPage || 0
            })
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])


    return { users, loading, error, pageInfo, getAllUser }
}

export default useGetAllUser