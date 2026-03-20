package com.transaction;


import com.models.StatusType;
import com.models.TransactionType;
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
public class TransactionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;
    @Column(name = "from_account_id")
    private UUID fromAccountId;

    @Column(name = "to_account_id")
    private UUID toAccountId;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionType transaction_type;

    @Enumerated(EnumType.STRING)
    private StatusType status;

    @Column(name = "reference_no")
    private String referenceNo;

    private String note;


    private LocalDateTime created_at;






}
