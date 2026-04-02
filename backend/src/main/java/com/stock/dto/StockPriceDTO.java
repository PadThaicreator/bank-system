package com.stock.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class StockPriceDTO {


    private BigDecimal currentPrice;
    private BigDecimal change;
    private BigDecimal percentChange;
    private BigDecimal high;
    private BigDecimal low;
    private BigDecimal open;
    private BigDecimal previousClose;
    private Long timestamp;


    public static StockPriceDTO from(StockPriceResponse res) {
        if (res == null) return null;

        return StockPriceDTO.builder()
                .currentPrice(res.getCurrentPrice())
                .change(res.getChange())
                .percentChange(res.getPercentChange())
                .high(res.getHigh())
                .low(res.getLow())
                .open(res.getOpen())
                .previousClose(res.getPreviousClose())
                .timestamp(res.getTimestamp())
                .build();
    }
}