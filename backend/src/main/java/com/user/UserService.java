package com.user;


import com.models.StatusType;
import com.transaction.TransactionModel;
import com.user.dto.LoginDTO;
import com.user.dto.UpdateProfileDTO;
import com.user.dto.UserDTO;
import com.user.expception.AuthenError;
import com.user.expception.UserError;
import com.configuration.auth.jwt.JwtUtil;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        data.setStatus(StatusType.ACTIVE);
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

            if(user.getStatus().equals(StatusType.INACTIVE)){
                throw new AuthenError.InactiveUser("User is inactive");
            }


            if(passwordEncoder.matches(password, user.getPasswordHash()) ){

                String getToken = jwtUtil.generateAccessToken(user.getId().toString() , user.getRole());
                String getRefreshToken = jwtUtil.generateRefreshToken(user.getId().toString());

                UserModel userLogin = new UserModel();
                userLogin.setRole(user.getRole());
                userLogin.setEmail(user.getEmail());
                userLogin.setFullName(user.getFullName());
                userLogin.setId(user.getId());
                userLogin.setPhone(user.getPhone());




                rs.setUserLogin(userLogin);
                rs.setMSG(getToken);
                rs.setRefreshToken(getRefreshToken);
                rs.setCODE("200");
                return rs;
            }else{

                throw new AuthenError.InvalidForm("Invalid Password");
            }



    }

    public ReturnClass RefreshToken(String refreshToken) {
        ReturnClass rs = new ReturnClass();
        if (refreshToken == null || !jwtUtil.isTokenValid(refreshToken)) {
            throw new AuthenError.InvalidForm("Invalid or Expired Refresh Token");
        }
        
        String userIdStr = jwtUtil.extractUserId(refreshToken);
        UUID userId = UUID.fromString(userIdStr);
        UserModel user = UserRepository.findById(userId)
                .orElseThrow(() -> new AuthenError.InvalidForm("User not found"));
                
        if (user.getStatus().equals(StatusType.INACTIVE)) {
            throw new AuthenError.InactiveUser("User is inactive");
        }

        String newToken = jwtUtil.generateAccessToken(user.getId().toString(), user.getRole());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId().toString());
        
        rs.setMSG(newToken);
        rs.setRefreshToken(newRefreshToken);
        rs.setCODE("200");
        return rs;
    }

    public ReturnDataClass<UserDTO> GetAllUser(int page, int size){



        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        Page<UserModel> userPage = UserRepository.findAll(pageable);

        List<UserDTO> userDTOList =
                userPage.getContent()
                        .stream()
                        .map(UserDTO::fromEntity)
                        .toList();

        ReturnDataClass<UserDTO> rsData = new ReturnDataClass<UserDTO>();
        rsData.setUserList(userDTOList);


        rsData.setTotalElements(userPage.getTotalElements());
        rsData.setTotalPages(userPage.getTotalPages());
        rsData.setCurrentPage(userPage.getNumber());
        rsData.setPageSize(userPage.getSize());
        rsData.setFirst(userPage.isFirst());
        rsData.setLast(userPage.isLast());



        return rsData;
    }

    public ReturnClass getUserProfile(UUID userId) {
        UserModel user = UserRepository.findById(userId)
                .orElseThrow(() -> new UserError.UserDuplicateError("User not found"));
                
        ReturnClass rs = new ReturnClass();
        rs.setUserLogin(user);
        rs.setMSG("Success");
        return rs;
    }

    @Transactional
    public ReturnClass updateUserProfile(UUID userId, UpdateProfileDTO data) {
        UserModel user = UserRepository.findById(userId)
                .orElseThrow(() -> new UserError.UserDuplicateError("User not found"));
                
        user.setFullName(data.getFullName());
        user.setPhone(data.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
        
        UserRepository.save(user);
        
        ReturnClass rs = new ReturnClass();
        rs.setUserLogin(user);
        rs.setCODE("200");
        rs.setMSG("Profile updated successfully");
        return rs;
    }


    @Transactional
    public ReturnClass editUser(UserDTO data) {
        UserModel user = UserRepository.findById(data.getId())
                .orElseThrow(() -> new UserError.UserDuplicateError("User not found"));


        UserModel findByEmail = UserRepository.findByEmail(data.getEmail()).orElse(null);

        if(findByEmail != null && findByEmail.getEmail().equals(data.getEmail()) && !findByEmail.getId().equals(data.getId())){
            throw new AuthenError.InvalidForm("Duplicate Email");
        }
        user.setFullName(data.getFullName());
        user.setPhone(data.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
        user.setEmail(data.getEmail());
        user.setGender(data.getGender());
        user.setBirthDate(data.getBirthDay());
        user.setRole(data.getRole());
        user.setStatus(data.getStatus());

        UserRepository.save(user);

        ReturnClass rs = new ReturnClass();
        rs.setUserLogin(user);
        rs.setCODE("200");
        rs.setMSG("Edit User Success");
        return rs;
    }



}
