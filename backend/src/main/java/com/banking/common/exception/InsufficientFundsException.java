package com.banking.common.exception;

import java.math.BigDecimal;

public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(BigDecimal available, BigDecimal required) {
        super("Insufficient funds. Available: " + available + ", Required: " + required);
    }
}