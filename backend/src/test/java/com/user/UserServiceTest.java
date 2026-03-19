package com.user;

import com.models.StatusType;
import com.models.UserRole;
import com.transaction.TransactionModel;

import com.user.UserModel;
import com.user.UserRepository;
import com.user.UserService;
import com.user.dto.LoginDTO;
import com.user.expception.AuthenError;
import com.configuration.auth.jwt.JwtUtil;
import com.models.ReturnClass;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtUtil jwtUtil = mock(JwtUtil.class);
    private final UserService authService = new UserService(userRepository, passwordEncoder, jwtUtil);

    @Test
    void login_success_shouldReturnToken() {
        // Arrange
        LoginDTO dto = new LoginDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("password123");

        UserModel user = new UserModel();
        user.setId(UUID.randomUUID());
        user.setPasswordHash("hashedPassword");
        user.setStatus(StatusType.ACTIVE);
        user.setRole(UserRole.CUSTOMER);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateAccessToken(anyString(), anyString())).thenReturn("token1234");

        // Act
        ReturnClass result = authService.Login(dto);

        // Assert
        assertEquals("200", result.getCODE());
        assertEquals("token123", result.getMSG());
    }

    @Test
    void login_invalidEmail_shouldThrowException() {
        LoginDTO dto = new LoginDTO();
        dto.setEmail("wrong@example.com");
        dto.setPassword("password123");

        when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

        assertThrows(AuthenError.InvalidForm.class, () -> authService.Login(dto));
    }

    @Test
    void login_invalidPassword_shouldThrowException() {
        LoginDTO dto = new LoginDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("wrongpassword");

        UserModel user = new UserModel();
        user.setPasswordHash("hashedPassword");
        user.setStatus(StatusType.ACTIVE);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashedPassword")).thenReturn(false);

        assertThrows(AuthenError.InvalidForm.class, () -> authService.Login(dto));
    }

    @Test
    void login_inactiveUser_shouldThrowException() {
        LoginDTO dto = new LoginDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("password123");

        UserModel user = new UserModel();
        user.setPasswordHash("hashedPassword");
        user.setStatus(StatusType.INACTIVE);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);

        assertThrows(AuthenError.InvalidForm.class, () -> authService.Login(dto));
    }
}
