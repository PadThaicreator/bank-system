package com.example.demo.routes;

import com.example.demo.ReturnClass;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.Date;


@RestController
public class TestRoute {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }


    @GetMapping("/hello")
    public ReturnClass Hello() {

        ReturnClass rs = new ReturnClass();

        String token = Jwts.builder()
                .setSubject("namo")
                .claim("role", "ADMIN")
                .claim("userId", 10)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();

        rs.setCODE("20000");
        rs.setMSG(token);
        return rs;
    }

    @PostMapping("/hello")
    public ReturnClass HelloPost(@RequestBody ReturnClass data) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(data.getCODE())
                .getPayload();

        String username = claims.getSubject();
        String role = claims.get("role", String.class);

        ReturnClass rs = new ReturnClass();

        rs.setCODE(username);
        rs.setMSG(role);

        return rs;
    }
}