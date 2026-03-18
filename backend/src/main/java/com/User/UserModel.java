package com.User;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor


@Entity
@Table(name = "transactions")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;
    @Column(name = "from_account_id")
    private UUID from_account_id;

    @Column(name = "to_account_id")
    private UUID to_account_id;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Transaction transaction_type;

    @Enumerated(EnumType.STRING)
    private Status status;
    private String reference_no;
    private String note;


    private LocalDateTime created_at;


    public enum Status {
        ACTIVE,
        INACTIVE,
        SUSPENDED
    }

    public enum Transaction {
        WITHDRAW,
        DEPOSIT,
        TRANSFER
    }



}
