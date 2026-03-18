package com.User;


import com.Transaction.TransactionModel;
import com.User.dto.LoginDTO;
import com.User.expception.AuthenError;
import com.User.expception.UserError;
import com.configuration.auth.jwt.JwtUtil;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public  class UserService {
    private final UserRepository  UserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository UserRepository, PasswordEncoder passwordEncoder , JwtUtil jwtUtil ) {
        this.UserRepository = UserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public  ReturnClass RegisterUser(UserModel data){
        ReturnClass rs = new ReturnClass();
        String password = data.getPasswordHash();
        data.setPasswordHash(passwordEncoder.encode(password));
        data.setStatus(TransactionModel.Status.ACTIVE);
        data.setCreatedAt(LocalDateTime.now());

        if (UserRepository.existsByEmail(data.getEmail())) {
            throw new UserError.UserDuplicateError("Email already exists");
        }

        try {
            UserRepository.save(data);
            rs.setMSG("Register Success");
            rs.setCODE("200");
            return rs;

        } catch (Exception e) {

            rs.setCODE("500");
            rs.setMSG("Register Failed");
            return rs;
        }

    }


    public ReturnClass Login(LoginDTO data){
        ReturnClass rs = new ReturnClass();
        String password = data.getPassword();
        String email = data.getEmail();


            UserModel user = UserRepository.findByEmail(email).orElseThrow(() -> new AuthenError.InvalidForm("Invalid Email"));

            List<UserModel> list = new ArrayList<>();;
            ReturnDataClass rsData = new ReturnDataClass();
            if(passwordEncoder.matches(password, user.getPasswordHash()) && user.getStatus() != TransactionModel.Status.INACTIVE){


                String getToken = jwtUtil.generateAccessToken(user.getId().toString() , user.getRole().toString());



                rs.setMSG(getToken);
                rs.setCODE("200");
                return rs;
            }else{

                throw new AuthenError.InvalidForm("Invalid Password");
            }



    }
}
