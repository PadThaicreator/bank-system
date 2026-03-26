package com.transaction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.models.TransactionType;
import com.transaction.TransactionModel;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @JsonProperty("created_at")
    private LocalDateTime createdAt;




    public static TransactionDTO fromEntity(TransactionModel t) {
        if (t == null) return null;

        TransactionDTO.TransactionDTOBuilder builder = TransactionDTO.builder()
                .referenceNo(t.getReferenceNo())
                .note(t.getNote())
                .amount(t.getAmount())
                .type(t.getTransaction_type())
                .createdAt(t.getCreatedAt());

        switch (t.getTransaction_type()) {

            case TRANSFER -> {
                if (t.getFromAccount() != null)
                    builder.fromAccountId(t.getFromAccount().getId());

                if (t.getToAccount() != null)
                    builder.toAccountId(t.getToAccount().getId());
            }

            case WITHDRAW -> {
                if (t.getFromAccount() != null)
                    builder.fromAccountId(t.getFromAccount().getId());
            }

            case DEPOSIT -> {
                if (t.getToAccount() != null)
                    builder.toAccountId(t.getToAccount().getId());
            }
        }

        return builder.build();
    }

    // helper สำหรับ mapping list
    public static List<TransactionDTO> fromEntityList(List<TransactionModel> transactions) {
        return transactions.stream()
                .map(TransactionDTO::fromEntity)
                .toList();
    }

}
