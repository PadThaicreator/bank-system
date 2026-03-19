package com.configuration.account.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.configuration.account.Account;
import com.configuration.account.AccountCategory;
import com.configuration.account.AccountStatus;
import com.configuration.account.AccountType;

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
public class BalanceResponse {
    private String accountNumber;
    private BigDecimal balance;
    private LocalDateTime updatedAt;

    public static BalanceResponse from(Account account) {
        if (account == null) {
            return null;
        }

        return BalanceResponse.builder()
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
