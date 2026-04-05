package com.order;


import com.models.StatusType;
import com.portfolio.PortfolioModel;
import com.stock.StockModel;
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
@Table(name = "orders")
public class OrderModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private BigDecimal price;
    private BigDecimal amount;

    @Column(name = "remaining_amount")
    private BigDecimal remainingAmount;

    @Column(name = "account_id")
    private UUID accountId;


    @Enumerated(EnumType.STRING)
    private OrderType type;


    @Enumerated(EnumType.STRING)
    private OrderStatus status;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn(name = "portfolio_id", referencedColumnName = "id")
    private PortfolioModel portfolio;

    @ManyToOne
    @JoinColumn(name = "symbol", referencedColumnName = "symbol")
    private StockModel stock;


}
