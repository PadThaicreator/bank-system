package com.portfolio.dto;


import com.account.Account;
import com.portfolio.PortfolioModel;
import com.portfolio.PortfolioStatus;
import com.portfolioDetail.PortfolioDetailModel;
import com.portfolioDetail.dto.PortfolioDetailDTO;
import com.user.UserModel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PortfolioDTO {

    private String accountNumber;

    private String reason;

    private PortfolioStatus status;


    private LocalDateTime createdAt;
    private UUID userId;


    private UserModel user;

    private List<PortfolioDetailModel> details;

    public static PortfolioDTO fromEntity(PortfolioModel p) {

        return PortfolioDTO.builder()
                .accountNumber(p.getAccountNumber())
                .reason(p.getReason())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .userId(p.getUser().getId())
                .build();
    }


    public static List<PortfolioDTO> fromEntityList(List<PortfolioModel> list) {
        return list.stream()
                .map(PortfolioDTO::fromEntity)
                .toList();
    }



}
