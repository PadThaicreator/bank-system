package com.Transaction;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
public class TransactionDTO {


    @JsonProperty("to_account")
    private String to_account;

    @JsonProperty("from_account")
    private String from_account;

    @JsonProperty("type")
    private String type;

    @JsonProperty("amount")
    private Float amount;

    @JsonProperty("note")
    private String note;
}
