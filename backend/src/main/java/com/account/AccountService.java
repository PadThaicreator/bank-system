package com.account;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import com.account.dto.UserAccountResponse;
import com.models.ReturnDataClass;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import com.account.dto.AccountResponse;
import com.account.dto.BalanceResponse;
import com.account.dto.CreateAccountRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    // ======= POST METHOD ========================================================================
    // ======= Create Account =======
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

    // ======= PATCH METHOD ========================================================================
    // ------- Change Balance -------
    @Transactional
    public AccountResponse changeBalance(UUID accountId, BigDecimal amount) {
        // เดี๋ยวถ้ามี token แล้วจะทำการเช็คว่าเป็น admin หรือเป็นเจ้าของบัญชีไหม
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance().add(amount));
        Account saved = accountRepository.save(account);
        return AccountResponse.from(saved);
    }

    // ------- Delete Account -------
    @Transactional
    public AccountResponse deleteAccount(UUID accountId) {
        // เดี๋ยวถ้ามี token แล้วจะทำการเช็คว่าเป็น admin หรือเป็นเจ้าของบัญชีไหม
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus(AccountStatus.CLOSED);
        Account saved = accountRepository.save(account);
        return AccountResponse.from(saved);
    }

    // ======= GET METHOD ==========================================================================

    public BalanceResponse getAccountBalance(UUID accountId){
        // เดี๋ยวถ้ามี token แล้วจะทำการเช็คว่าเป็น admin หรือเป็นเจ้าของบัญชีไหม
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return new BalanceResponse(
            account.getAccountNumber(),
            account.getBalance(),
            account.getUpdatedAt()
        );
    }

    public List<AccountResponse> getAllAccounts(){
        // เดี๋ยวระบบ token มาแล้วจะเช็ค user ว่าเป็น admin ไหม
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
            .map(AccountResponse::from)
            .toList();
    }

    public AccountResponse getAccountById(UUID accountId){
        // เดี๋ยวถ้ามี token แล้วจะทำการเช็คว่าเป็น admin หรือเป็นเจ้าของบัญชีไหม
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return AccountResponse.from(account);
    }

    public List<UserAccountResponse> getAccountByUserId(UUID userId){
        // เดี๋ยวถ้ามี token แล้วจะทำการเช็คว่าเป็น admin หรือเป็นเจ้าของบัญชีไหม

        List<UserAccountResponse> accounts = accountRepository.findByUserId(userId);

        return accounts;
    }


    // ======= PRIVATE HELPER ======================================================================

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
