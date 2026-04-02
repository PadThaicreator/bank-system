package com.models;

import com.account.dto.UserAccountResponse;

import com.request.RequestModel;
import com.request.dto.RequestDTO;
import com.transaction.dto.TransactionDTO;
import com.user.UserModel;
import com.user.dto.UserDTO;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
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

    public ReturnDataClass(Page<T> page) {
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.currentPage = page.getNumber();
        this.pageSize = page.getSize();
        this.first = page.isFirst();
        this.last = page.isLast();
        this.content = page.getContent();
    }


    public static <T>   ReturnDataClass<T> fromEntity(Page<T> page) {
        if (page == null) return null;

        return ReturnDataClass.<T>builder()
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
