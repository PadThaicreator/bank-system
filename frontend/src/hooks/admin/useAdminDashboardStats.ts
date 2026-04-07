import { useState, useCallback, useEffect } from "react";
import { adminService } from "../../services/adminService";
import type { AdminDashboardStats } from "../../services/adminService";

export function useAdminDashboardStats() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (dateString?: string) => {
        setLoading(true);
        setError(null);
        try {
            const dateStr = dateString || new Date().toISOString().split('T')[0];
            const data = await adminService.getDashboardStats(dateStr);
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}
