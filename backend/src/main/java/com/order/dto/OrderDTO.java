package com.order.dto;


import com.order.OrderModel;
import com.order.OrderStatus;
import com.order.OrderType;
import com.portfolio.PortfolioModel;
import com.request.RequestModel;
import com.request.dto.RequestDTO;
import com.stock.StockModel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrderDTO {

    private UUID id;
    private BigDecimal price;
    private BigDecimal amount;


    @Enumerated(EnumType.STRING)
    private OrderType type;


    private LocalDateTime createdAt;


    private UUID portfolioId;
    private String symbol;
    private UUID accountId;

    private PortfolioModel portfolio;

    private StockModel stock;

    public static OrderDTO fromEntity(OrderModel t) {
        if (t == null) return null;

        OrderDTO.OrderDTOBuilder builder = OrderDTO.builder()
                .createdAt(t.getCreatedAt())
                .id(t.getId())
                .createdAt(t.getCreatedAt())
                .amount(t.getAmount())
                .price(t.getPrice())
                .type(t.getType())
                .portfolioId(t.getPortfolio().getId())
                .symbol(t.getStock().getSymbol())
                .accountId(t.getAccountId())
                .portfolio(t.getPortfolio())
                .stock(t.getStock());


        return builder.build();
    }

    public static List<OrderDTO> fromEntityList(List<OrderModel> data) {
        return data.stream()
                .map(OrderDTO::fromEntity)
                .toList();
    }
}
