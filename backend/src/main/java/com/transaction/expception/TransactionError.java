package com.transaction.expception;

public class TransactionError  extends RuntimeException  {

    private final String code;

    public TransactionError(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }


    public static class TypeRequired extends TransactionError {
        public TypeRequired() {

            super("TYPE_REQUIRED", "Transaction type is required");
//            System.out.println("==========================================================================================");
        }
    }

    public static class AccountInvalid extends TransactionError {
        public AccountInvalid(String MSG) {
            super("ACCOUNT_INVALID", MSG);
        }
    }



    public static class InsufficientBalance extends TransactionError {
        public InsufficientBalance(String MSG) {
            super("INSUFFICIENT_BALANCE", MSG);
        }
    }

}
