package com.stock.dto;

import com.stock.StockModel;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class StockDTO {

    private String symbol;
    private String name;
    private String industry;
    private String logo;
    private  String type;
    private BigDecimal marketCap;



    public static StockDTO fromEntity(StockModel t) {
        if (t == null) return null;

        return StockDTO.builder()
                .symbol(t.getSymbol())
                .name(t.getName())
                .industry(t.getIndustry())
                .logo(t.getLogo())
                .type(t.getType())
                .marketCap(t.getMarketCap())
                .build();
    }

    // helper สำหรับ mapping list
    public static List<StockDTO> fromEntityList(List<StockModel> stock) {
        return stock.stream()
                .map(StockDTO::fromEntity)
                .toList();
    }


}
