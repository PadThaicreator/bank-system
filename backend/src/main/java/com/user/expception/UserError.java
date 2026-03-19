package com.user.expception;

public class UserError extends RuntimeException  {

    private final String code;

    public UserError(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }




    public static class UserDuplicateError extends UserError {
        public UserDuplicateError(String MSG) {
            super("EMAIL_DUPLICATE", MSG);
        }
    }



}
