package com.configuration.config.path;

public class ApiPaths {

    public static final String[] PUBLIC_PATHS = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/users/login",
            "/users/register",
            "/users/refreshToken",
            "/stocks/price/{symbol}",
            "/stocks"
    };


    public static final String[] PUBLIC_POST_PATHS = {
            "/requests/portfolio",
            "/transactions",
            "/requests",

    };

    public static final String[] ADMIN_PATHS = {
            "/users",
            "/transactions",
            "/requests/*"
    };




}
