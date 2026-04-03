package com.portfolioDetail;


import com.portfolio.PortfolioModel;
import com.portfolio.PortfolioStatus;
import com.stock.StockModel;
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
@Table(name = "portfolio_details")
public class PortfolioDetailModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    private BigDecimal amount;
    private BigDecimal avg_price;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @ManyToOne
    @JoinColumn(name = "portfolio_id", referencedColumnName = "id")
    private PortfolioModel portfolio;

    @ManyToOne
    @JoinColumn(name = "symbol", referencedColumnName = "symbol")
    private StockModel stock;


}
