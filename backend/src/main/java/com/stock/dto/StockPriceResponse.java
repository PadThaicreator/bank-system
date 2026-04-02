package com.stock.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class StockPriceResponse {

    @JsonProperty("c")
    private BigDecimal currentPrice;

    @JsonProperty("d")
    private BigDecimal change;

    @JsonProperty("dp")
    private BigDecimal percentChange;

    @JsonProperty("h")
    private BigDecimal high;

    @JsonProperty("l")
    private BigDecimal low;

    @JsonProperty("o")
    private BigDecimal open;

    @JsonProperty("pc")
    private BigDecimal previousClose;

    @JsonProperty("t")
    private Long timestamp;
}