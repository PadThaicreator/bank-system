package com.request.expception;

public class RequestError extends RuntimeException  {

    private final String code;

    public RequestError(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }


    public static class RequestInvalid extends RequestError {
        public RequestInvalid(String MSG) {

            super("Request_INVALID", MSG);
        }
    }


}
