package com.account;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.account.dto.UserAccountResponse;

import com.request.RequestRepository;
import com.request.RequestService;
import com.request.RequestType;
import com.transaction.TransactionModel;
import com.transaction.TransactionRepository;
import com.transaction.TransactionService;
import com.transaction.dto.TransactionDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.account.dto.AccountResponse;
import com.account.dto.BalanceResponse;
import com.account.dto.ChangeAccountTypeRequest;
import com.account.dto.ChangeStatusRequest;
import com.account.dto.CreateAccountRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final RequestService requestService;


    // ======= POST METHOD
    // ========================================================================
    // ------- Create Account -------
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        UUID userId = UUID.fromString(userIdStr);

        Account account = Account.builder()
                .userId(userId)
                .accountNumber(generateAccountNumber(request.getAccountType()))
                .accountType(request.getAccountType())
                .accountCategory(request.getAccountType().getCategory())
                .balance(request.getInitialDeposit())
                .status(AccountStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();



        Account saved = accountRepository.save(account);
        requestService.createRequest(saved.getId(), RequestType.OPEN_ACCOUNT.toString(), RequestType.OPEN_ACCOUNT);

        return AccountResponse.from(saved);
    }

    // ======= PATCH METHOD
    // ========================================================================
    // ------- Change Balance -------
    @Transactional
    public AccountResponse changeBalance(UUID accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyOwnershipOrAdmin(account.getUserId());

        account.setBalance(account.getBalance().add(amount));
        Account saved = accountRepository.save(account);
        return AccountResponse.from(saved);
    }

    // ------- Change Status -------
    @Transactional
    public AccountResponse changeAccountStatus(UUID accountId, ChangeStatusRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyOwnershipOrAdmin(account.getUserId());

//        account.setStatus(request.getStatus());
        Account saved = accountRepository.save(account);
        requestService.createRequest(saved.getId(), request.getStatus().toString(), RequestType.CHANGE_ACCOUNT_STATUS);

        return AccountResponse.from(saved);
    }

    // ------- Change Account Type -------
    @Transactional
    public AccountResponse changeAccountType(UUID accountId, ChangeAccountTypeRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyOwnershipOrAdmin(account.getUserId());

//        account.setAccountType(AccountType.valueOf(request.getAccountType()));
        Account saved = accountRepository.save(account);
        requestService.createRequest(saved.getId(), request.getAccountType(), RequestType.CHANEG_ACCOUNT_TYPE);

        return AccountResponse.from(saved);
    }

    // ------- Delete Account -------
    @Transactional
    public AccountResponse deleteAccount(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyOwnershipOrAdmin(account.getUserId());
        account.setStatus(AccountStatus.CLOSED);
        Account saved = accountRepository.save(account);
        return AccountResponse.from(saved);
    }

    // ======= GET METHOD
    // ==========================================================================

    public BalanceResponse getAccountBalance(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyOwnershipOrAdmin(account.getUserId());
        return new BalanceResponse(
                account.getAccountNumber(),
                account.getBalance(),
                account.getUpdatedAt());
    }

    public List<AccountResponse> getAllAccounts() {
        verifyAdmin();

        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
                .map(AccountResponse::from)
                .toList();
    }

    public AccountResponse getAccountById(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        verifyOwnershipOrAdmin(account.getUserId());
        return AccountResponse.from(account);
    }

    public List<UserAccountResponse> getAccountByUserId() {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        UUID userId = UUID.fromString(userIdStr);

        List<UserAccountResponse> accounts = accountRepository.findByUserId(userId);

        return accounts;
    }




    // ======= PRIVATE HELPER
    // ======================================================================

    private void verifyOwnershipOrAdmin(UUID ownerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Unauthorized: No authentication found");
        }

        String currentUserId = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (!isAdmin && !currentUserId.equals(ownerId.toString())) {
            throw new RuntimeException("Unauthorized: You do not have permission to access this resource");
        }
    }

    private void verifyAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new RuntimeException("Unauthorized: No authentication found");
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Unauthorized: Admin access required");
        }
    }

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
