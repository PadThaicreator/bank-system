package com.models;

import lombok.Data;

@Data
public class AdminDashboardStats {
    private long totalUsers;
    private long totalAccounts;
    private long todayTransactionCount;
    private double todayTransactionValue;
    private long suspendedUsers;
    private long suspendedAccounts;
}
