package com.configuration.account;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.configuration.account.dto.AccountResponse;
import com.configuration.account.dto.BalanceResponse;
import com.configuration.account.dto.CreateAccountRequest;
import com.configuration.common.response.ApiResponse;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api")
class AccountController {

    private final AccountService accountService;

    AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    //========================================= POST METHOD ========================================

    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @RequestParam UUID userId,
            @RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Account created successfully", response));
    }

    //========================================= PATCH METHOD ========================================

    @PatchMapping("/accounts/{accountId}/change-balance")
    public ResponseEntity<ApiResponse<AccountResponse>> changeBalance(
            @PathVariable UUID accountId,
            @RequestParam BigDecimal amount) {
        AccountResponse response = accountService.changeBalance(accountId, amount);
        return ResponseEntity.ok(ApiResponse.success("Balance changed successfully", response));
    }


    //========================================= GET METHOD ========================================

    @GetMapping("/accounts/{accountid}/getAccountBalance")
    public ResponseEntity<ApiResponse<BalanceResponse>> getAccountBalance(
            @PathVariable UUID accountid) {
        BalanceResponse response = accountService.getAccountBalance(accountid); 
        return ResponseEntity.ok(ApiResponse.success("Get account balance successfully", response));
    }
    
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccount() {
        List<AccountResponse> responses = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success("Get all account successfully", responses));
    }

    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountFromId(
            @PathVariable UUID accountId){
        AccountResponse response = accountService.getAccountById(accountId);
        return ResponseEntity.ok(ApiResponse.success("Get account successfully", response));
    }
}
