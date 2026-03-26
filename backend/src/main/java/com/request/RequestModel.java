package com.request;


import com.account.Account;
import com.models.StatusType;
import com.models.TransactionType;
import com.user.UserModel;
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
@Table(name = "requests")
public class RequestModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;



    @Enumerated(EnumType.STRING)
    @Column(name = "request_type")
    private RequestType requestType;

    @Enumerated(EnumType.STRING)
    private StatusType status;

    private String data;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "approved_at")
    private LocalDateTime approvedAt;


//    FK-KEY

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approve_by", referencedColumnName = "id")
    private UserModel approveBy;











}
