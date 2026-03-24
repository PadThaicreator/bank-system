package com.account.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.account.Account;
import com.account.AccountCategory;
import com.account.AccountStatus;
import com.account.AccountType;
import com.user.UserModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountWithOwnerResponse {
    private UUID id;
    private UUID userId;
    private String accountNumber;
    private AccountType accountType;
    private AccountCategory accountCategory;
    private BigDecimal balance;
    private AccountStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String ownerName;

    public static AccountWithOwnerResponse from(Account account, UserModel user) {
        if (account == null) {
            return null;
        }

        return AccountWithOwnerResponse.builder()
                .id(account.getId())
                .userId(account.getUserId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .accountCategory(account.getAccountCategory())
                .balance(account.getBalance())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .ownerName(user != null ? user.getFullName() : "Unknown")
                .build();
    }
}
