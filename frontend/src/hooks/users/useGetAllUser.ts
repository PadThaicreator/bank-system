import { useCallback, useState } from "react"

import type { PaginatedUserResponse, UserDTO } from "../../types/userType"
import { userService } from "../../services/userService";



export function useGetAllUser () {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);

    const getAllUser = useCallback(async (page: number = 0, size: number = 10) => {
        setLoading(true)
        setError(null)
        try{
            const res = await userService.getAllUser(page, size);
            // res is actually PaginatedUserResponse at runtime due to axios interceptor returning response.data
            const responseData = res as unknown as PaginatedUserResponse;
            console.log(responseData);
            if (responseData?.data?.userList) {
                setUsers(responseData.data.userList);
                setTotalPages(responseData.data.totalPages || 1);
                setTotalElements(responseData.data.totalElements || 0);
            } else {
                setUsers([]);
                setTotalPages(1);
                setTotalElements(0);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])


    return { users, totalPages, totalElements, loading, error, getAllUser }
}

export default useGetAllUser