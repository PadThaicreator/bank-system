package com.stock.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Data
@Getter
@Setter
public class ProfileCompanyResponse {
    private String country;

    private String currency;

    private String estimateCurrency;

    private String exchange;

    @JsonProperty("finnhubIndustry")
    private String finnhubIndustry;

    private String ipo;

    private String logo;

    private BigDecimal marketCapitalization;

    private String name;

    private String phone;

    private Double shareOutstanding;

    private String ticker;

    private String weburl;
}
