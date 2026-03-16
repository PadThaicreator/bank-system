package com.controllers;

import com.configuration.auth.jwt.JwtUtil;
import com.dtos.LoginDTO;
import com.dtos.ReturnClass;
import com.dtos.ReturnDataClass;
import com.models.UserModel;
import com.repositories.UserRepository;
import io.jsonwebtoken.security.Keys;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@RestController
public class TestController {



    private final UserRepository  UserRepository;
    private final PasswordEncoder passwordEncoder;

    public TestController(UserRepository UserRepository, PasswordEncoder passwordEncoder ) {
        this.UserRepository = UserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/test-open")
    public String test() {
        return "OPEN";
    }
//    @GetMapping("/hello")
//    public ReturnClass Hello() {
//
//        ReturnClass rs = new ReturnClass();
//
//
//        rs.setCODE("200");
//        rs.setMSG(token);
//        return rs;
//    }

    @PostMapping("/register")
    public ReturnClass Register(@RequestBody UserModel data) {

        String password = data.getPassword_hash();

        data.setPassword_hash(passwordEncoder.encode(password));


        data.setCreated_at(LocalDateTime.now());


        ReturnClass rs = new ReturnClass();



        try {
            UserRepository.save(data);

            rs.setCODE("200");
            rs.setMSG("Register Success");

        } catch (Exception e) {
            rs.setCODE("400");
            rs.setMSG("Register Failed");
        }

        return rs;
    }


    @PostMapping("/login")
    public ReturnClass Login(@Valid @RequestBody LoginDTO data) {
        ReturnClass rs = new ReturnClass();
        String password = data.getPassword();
        String email = data.getEmail();

        UserModel user = UserRepository.findByEmail(email);

        List<UserModel> list = new ArrayList<>();;
        ReturnDataClass rsData = new ReturnDataClass();
        if(passwordEncoder.matches(password, user.getPassword_hash()) && user.getStatus() != "INACTIVE"){
            UserModel returnUser = new UserModel();
            returnUser.setEmail(user.getEmail());
            returnUser.setRole(user.getRole());
            returnUser.setFull_name(user.getFull_name());
            list.add(returnUser);

            rsData.setUserList(list);

            rs.setData(rsData);
            rs.setMSG("Login Success");
            rs.setCODE("200");
            rs.setSuccessReturn();
        }else{
            rs.setMSG("Login Failed");
            rs.setCODE("500");
            rs.setErrorReturn();
        }


        return rs;
    }

//    .save();
//    .delete();


}