package com.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "accounts")
public class AccountModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;


    @Column(columnDefinition = "uuid")
    private UUID user_id;
    @Column(nullable=false)
    private String account_number;
    @Enumerated(EnumType.STRING)
    private AccountType account_type;
    @Column(nullable=false)
    private Float balance;

    private String status;
    private String created_at;
    private String updated_at;


    public enum AccountType {
        CURRENT,
        SAVINGS
    }



}
