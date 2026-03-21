package com.account.dto;

import com.account.AccountCategory;
import com.account.AccountStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountResponse {


    private  UUID id;
    private  String accountNumber;
    private  BigDecimal balance;
    private  AccountStatus status;
    private  AccountCategory accountCategory;


}
