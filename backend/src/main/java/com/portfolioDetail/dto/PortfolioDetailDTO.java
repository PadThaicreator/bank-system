package com.portfolioDetail.dto;


import com.portfolio.PortfolioModel;
import com.stock.StockModel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PortfolioDetailDTO {




    private BigDecimal amount;
    private BigDecimal avg_price;



    private UUID portfolioId;


    private String symbol;



}
