package com.User;


import com.Transaction.TransactionModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "users")
public class UserModel {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(columnDefinition = "uuid")
        private UUID id;

        @Column(name = "full_name", nullable=false)
        @NotBlank(message = "Username is required")
        private String fullName;

        @Column(nullable=false , unique = true)
        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        private String email;

        @Column(name = "password_hash", nullable=false)
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String passwordHash;

        @Column(nullable=false)
        private String phone;

        @Enumerated(EnumType.STRING)
        private Role role;

        @Enumerated(EnumType.STRING)
        private TransactionModel.Status status;

        @Column(name = "created_at")
        private LocalDateTime createdAt;

        @Column(name = "updated_at")
        private LocalDateTime updatedAt;


    public enum Role {
        CUSTOMER,
        ADMIN,

    }
}
