import { useState } from "react";
import { userService } from "../../services/userService";
import type { UserDTO } from "../../types/userType";

export function useEditUser() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const editUser = async (data: UserDTO) => {
        setLoading(true);
        setError(null);
        try {
            const res = await userService.editUser(data);
            return res;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.details || err.response?.data?.message || err.message || "An error occurred while editing the user";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, editUser };
}

export default useEditUser;