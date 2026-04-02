package com.configuration.config.path;

public class ApiPaths {

    public static final String[] PUBLIC_PATHS = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/users/login",
            "/users/register",
            "/users/refreshToken",
            "/stocks/price/{symbol}"
    };


    public static final String[] PUBLIC_POST_PATHS = {

            "/transactions",
            "/requests",

    };

    public static final String[] ADMIN_PATHS = {
            "/users",
            "/transactions",
            "/stocks",
            "/requests/{id}"
    };




}
