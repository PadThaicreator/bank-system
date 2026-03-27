package com.request.dto;


import com.account.Account;
import com.account.AccountType;
import com.account.dto.AccountResponse;
import com.models.StatusType;
import com.models.TransactionType;
import com.request.RequestModel;
import com.request.RequestType;
import com.transaction.TransactionModel;
import com.transaction.dto.TransactionDTO;
import com.user.UserModel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDTO {


    private UUID id;

    private RequestType requestType;

    private StatusType status;

    private String data;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    private Account account;

    private UserModel approveBy;

    private AccountResponse accountRequest;




    public static RequestDTO fromEntity(RequestModel t) {
        if (t == null) return null;

        RequestDTO.RequestDTOBuilder builder = RequestDTO.builder()
                .createdAt(t.getCreatedAt())
                .id(t.getId())
                .account(t.getAccount())
                .data(t.getData())
                .requestType(t.getRequestType())
                .approvedAt(t.getApprovedAt())
                .approveBy(t.getApproveBy())
                .status(t.getStatus());


        return builder.build();
    }

    // helper สำหรับ mapping list
    public static List<RequestDTO> fromEntityList(List<RequestModel> transactions) {
        return transactions.stream()
                .map(RequestDTO::fromEntity)
                .toList();
    }


}
