package com.account.dto;

import com.account.AccountType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class ChangeAccountTypeRequest {
    @NotNull(message = "Account type is required")
    private AccountType accountType;
}
