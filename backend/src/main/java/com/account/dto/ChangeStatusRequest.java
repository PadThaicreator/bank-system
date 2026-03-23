package com.account.dto;

import com.account.AccountStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class ChangeStatusRequest {
    @NotNull(message = "Account type is required")
    private AccountStatus status;
}
