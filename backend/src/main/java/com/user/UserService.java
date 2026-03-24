package com.user;

import com.models.StatusType;
import com.user.dto.LoginDTO;
import com.user.dto.UserDTO;
import com.user.expception.AuthenError;
import com.user.expception.UserError;
import com.configuration.auth.jwt.JwtUtil;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService {
    private final UserRepository UserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository UserRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.UserRepository = UserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public ReturnClass RegisterUser(UserModel data) {
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

    public ReturnClass Login(LoginDTO data) {
        ReturnClass rs = new ReturnClass();
        String password = data.getPassword();
        String email = data.getEmail();

        UserModel user = UserRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenError.InvalidForm("Invalid Email"));

        if (user.getStatus().equals(StatusType.INACTIVE)) {
            throw new AuthenError.InactiveUser("User is inactive");
        }

        if (passwordEncoder.matches(password, user.getPasswordHash())) {

            String getToken = jwtUtil.generateAccessToken(user.getId().toString(), user.getRole().toString());
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
        } else {

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

        String newToken = jwtUtil.generateAccessToken(user.getId().toString(), user.getRole().toString());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId().toString());

        rs.setMSG(newToken);
        rs.setRefreshToken(newRefreshToken);
        rs.setCODE("200");
        return rs;
    }

    public ReturnClass GetAllUser() {
        ReturnClass rs = new ReturnClass();

        List<UserModel> userList = UserRepository.findAll();

        List<UserDTO> userDTOList = userList.stream()
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setFullName(user.getFullName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole());
                    dto.setPhone(user.getPhone());
                    dto.setStatus(user.getStatus());
                    dto.setCreatedAt(user.getCreatedAt());
                    dto.setUpdatedAt(user.getUpdatedAt());
                    dto.setBirthDay(user.getBirthDay());
                    dto.setGender(user.getGender());
                    return dto;
                })
                .toList();

        ReturnDataClass rsData = new ReturnDataClass();
        rsData.setUserList(userDTOList);

        rs.setData(rsData);

        return rs;
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
    public ReturnClass updateUserProfile(UUID userId, com.user.dto.UpdateProfileDTO data) {
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
}