package com.user.dto;

import com.models.StatusType;
import com.models.UserGender;
import com.models.UserRole;
import com.user.UserModel;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@Builder
public class UserDTO {

    private UUID id;
    private String fullName;
    private String email;
    private UserRole role;
    private String phone;
    private StatusType status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate birthDay;
    private UserGender gender;


    public static UserDTO fromEntity(UserModel user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .birthDay(user.getBirthDate())
                .gender(user.getGender())
                .build();
    }


}
