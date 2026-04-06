package com.dashboard.dto;

import com.user.UserModel;
import lombok.Data;
import java.util.List;

@Data
public class UserPageDTO {
    private List<UserModel> content;
    private long totalElements;
    private int totalPages;
    private int size;
    private int number;

    public UserPageDTO(org.springframework.data.domain.Page<UserModel> page) {
        this.content = page.getContent();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.size = page.getSize();
        this.number = page.getNumber();
    }
}
