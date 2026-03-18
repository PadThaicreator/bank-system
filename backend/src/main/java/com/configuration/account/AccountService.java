package com.configuration.account;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import com.configuration.account.dto.AccountResponse;
import com.configuration.account.dto.CreateAccountRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    @Transactional
    public AccountResponse createAccount(UUID userId, CreateAccountRequest request) {
        // String userIdStr =
        // SecurityContextHolder.getContext().getAuthentication().getName();
        // UUID userId = UUID.fromString(userIdStr);

        Account account = Account.builder()
                .userId(userId)
                .accountNumber(generateAccountNumber(request.getAccountType()))
                .accountType(request.getAccountType())
                .accountCategory(request.getAccountType().getCategory())
                .balance(request.getInitialDeposit())
                .status(AccountStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Account saved = accountRepository.save(account);
        return AccountResponse.from(saved);
    }

    // ======= PRIVATE HELPER
    // =======================================================

    private String generateAccountNumber(AccountType accountType) {
        // format: BBB-T-XXXXXX
        // BBB = branchNumber (fixed ไปก่อน)
        // T = accountType numberValue
        // XXXXXX = random 6 หลัก

        String branchNumber = "001"; // fixed รอ branch feature
        String typeNumber = accountType.getNumberValue();
        String random = String.format("%06d", (int) (Math.random() * 1000000));

        return branchNumber + typeNumber + random;
    }
}
