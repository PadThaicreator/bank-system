package com.models;


import jakarta.persistence.*;
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

    @Column(nullable=false)
    private String full_name;
    @Column(nullable=false)
    private String email;
    @Column(nullable=false)
    private String password_hash;
    @Column(nullable=false)
    private String phone;
    private String role;
    private String status;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}
