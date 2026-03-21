package com.transaction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.models.TransactionType;
import com.transaction.TransactionModel;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {


    @JsonProperty("to_account_id")
    private UUID toAccountId;

    @JsonProperty("from_account_id")
    private UUID fromAccountId;

    @JsonProperty("type")
    private TransactionType type;

    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("note")
    private String note;

    @JsonProperty("reference_no")
    private String referenceNo;

    @JsonProperty("to_account_number")
    private String toAccountNumber;


    @JsonProperty("from_account_number")
    private String fromAccountNumber;





    public static TransactionDTO fromEntity(TransactionModel t) {
        if (t == null) return null;

        return TransactionDTO.builder()
                .referenceNo(t.getReferenceNo())
                .note(t.getNote())
                .amount(t.getAmount())
                .type(t.getTransaction_type())
                .fromAccountId(t.getFromAccountId())
                .toAccountId(t.getToAccountId())
                .build();
    }

    // helper สำหรับ mapping list
    public static List<TransactionDTO> fromEntityList(List<TransactionModel> transactions) {
        return transactions.stream()
                .map(TransactionDTO::fromEntity)
                .toList();
    }
}
