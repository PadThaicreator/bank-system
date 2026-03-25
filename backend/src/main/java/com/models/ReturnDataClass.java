package com.models;

import com.account.dto.UserAccountResponse;

import com.transaction.dto.TransactionDTO;
import com.user.dto.UserDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReturnDataClass<T> {

    private List<TransactionDTO> transactionList;
    private List<UserDTO> userList;
    private List<UserAccountResponse> accountList;

 
    private List<T> content;

    // pagination metadata
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private boolean first;
    private boolean last;
}
