package com.configuration.account.dto;

import java.math.BigDecimal;

import com.configuration.account.AccountType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class CreateAccountRequest {
    @NotNull(message = "Account type is required")
    private AccountType accountType;

    private BigDecimal initialDeposit;
}
