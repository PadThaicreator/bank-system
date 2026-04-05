import { useState } from "react"
import { orderService } from "../../services/orderService"
import type { OrderDTO } from "../../types/orderType"

export function useCreateOrder() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const createOrder = async (orderData: OrderDTO) => {
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            const res = await orderService.createOrder(orderData)
            setSuccess(true)
            return res.data
        } catch (err: any) {
            setError(err.response?.data?.error?.details || err.message || "Failed to create order")
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createOrder, loading, error, success }
}

export default useCreateOrder;
