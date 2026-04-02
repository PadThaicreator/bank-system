package com.stock;


import com.account.Account;
import com.models.StatusType;
import com.models.TransactionType;
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
@Table(name = "stocks")
public class StockModel {

    @Id
    private String symbol;
    private String name;
    private String industry;
    private String logo;
    private  String type;

    @Column(name = "market_cap")
    private BigDecimal marketCap;


}
