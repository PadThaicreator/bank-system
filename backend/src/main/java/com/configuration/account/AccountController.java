package com.configuration.account;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.account.dto.AccountResponse;
import com.configuration.account.dto.CreateAccountRequest;
import com.configuration.common.response.ApiResponse;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
class AccountController {

    private final AccountService accountService;

    AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // @GetMapping("/accounts")
    // public ResponseEntity<ApiResponse<List<Account>>> getAllAccount() {
    // return ResponseEntity.ok(repository.findAll());
    // }

    // @GetMapping("/accounts/{id}")
    // public ResponseEntity<ApiResponse<Account>> getAccountFromId(@PathVariable
    // UUID id){
    // return repository.findById(id)
    // .orElseThrow(() -> new
    // com.configuration.account.exception.AccountNotFoundException(id));
    // }

    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @RequestParam UUID userId,
            @RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Account created successfully", response));
    }

    @PostMapping("/accounts/{accountId}/change-balance")
    public ResponseEntity<ApiResponse<AccountResponse>> changeBalance(
            @PathVariable UUID accountId,
            @RequestParam BigDecimal amount) {
        AccountResponse response = accountService.changeBalance(accountId, amount);
        return ResponseEntity.ok(ApiResponse.success("Balance changed successfully", response));
    }

}
