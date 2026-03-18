package com.configuration.account.exception;

public class AccountNotFoundException extends RuntimeException{
    public AccountNotFoundException(long id) {
        super("Account id " + id + " not found");
    }
}
