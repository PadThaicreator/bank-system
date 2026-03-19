package com.user.expception;

public class AuthenError extends RuntimeException  {

    private final String code;

    public AuthenError(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }


    public static class InvalidForm extends AuthenError {
        public InvalidForm(String MSG) {

            super("INVALID_FORM", MSG);
        }
    }

    public static class InactiveUser extends AuthenError {
        public InactiveUser(String MSG) {

            super("USER_DISABLE", MSG);
        }
    }





}
