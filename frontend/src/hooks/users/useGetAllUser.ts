import { useCallback, useState } from "react"

import type { UserDTO } from "../../types/userType"
import { userService } from "../../services/userService";



export function useGetAllUser () {
    const [users, setUsers] = useState<UserDTO[]>();
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
 

    const getAllUser = useCallback(async () => {
        setLoading(true)
        setError(null)
        try{
            const res = await userService.getAllUser();
            setUsers(res.data)
            // console.log(res);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        }
        finally{
            setLoading(false)
        }
    }, [])


    return { users, loading, error, getAllUser }
}

export default useGetAllUser