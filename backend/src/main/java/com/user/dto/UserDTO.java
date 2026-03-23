package com.user.dto;

import com.models.StatusType;
import com.models.UserRole;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter

public class UserDTO {

    private UUID id;
    private String fullName;
    private String email;
    private UserRole role;
    private String phone;
    private StatusType status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
