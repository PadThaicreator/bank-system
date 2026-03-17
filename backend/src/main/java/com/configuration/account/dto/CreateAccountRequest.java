package com.configuration.account.dto;

import com.configuration.account.AccountType;

import lombok.Data;

@Data
public class CreateAccountRequest {
    private String username;
    private String email;
    private String password;
    private AccountType accountType;
}
