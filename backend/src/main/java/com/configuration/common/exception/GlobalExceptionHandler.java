package com.configuration.common.exception;

import com.Transaction.expception.TransactionError;
import com.User.expception.AuthenError;
import com.User.expception.UserError;
import com.configuration.common.response.ApiResponse;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiResponse.error("Resource not found",
                new ApiResponse.ErrorDetail("NOT_FOUND", ex.getMessage()))
        );
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsufficientFunds(InsufficientFundsException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ApiResponse.error("Transaction failed",
                new ApiResponse.ErrorDetail("INSUFFICIENT_FUNDS", ex.getMessage()))
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ApiResponse.error("Validation failed",
                new ApiResponse.ErrorDetail("VALIDATION_ERROR", details))
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleForbidden(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ApiResponse.error("Access denied",
                new ApiResponse.ErrorDetail("FORBIDDEN", "You don't have permission"))
        );
    }

    @ExceptionHandler(TransactionError.class)
    public ResponseEntity<ApiResponse<Void>> handleTransactionError(TransactionError ex) {

        return ResponseEntity.badRequest().body(
                ApiResponse.error(
                        "Transaction error",
                        new ApiResponse.ErrorDetail(ex.getCode(), ex.getMessage())
                )
        );
    }

    @ExceptionHandler(AuthenError.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenError(AuthenError ex) {

        return ResponseEntity.badRequest().body(
                ApiResponse.error(
                        "Authentication error",
                        new ApiResponse.ErrorDetail(ex.getCode(), ex.getMessage())
                )
        );
    }

    @ExceptionHandler(UserError.class)
    public ResponseEntity<ApiResponse<Void>> handleUserError(UserError ex) {

        return ResponseEntity.badRequest().body(
                ApiResponse.error(
                        "User Controller error",
                        new ApiResponse.ErrorDetail(ex.getCode(), ex.getMessage())
                )
        );
    }

    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidFormat(InvalidFormatException ex) {
        return ResponseEntity.badRequest().body(
                ApiResponse.error(
                        "Invalid request format",
                        new ApiResponse.ErrorDetail("INVALID_FORMAT", "UUID format is invalid")
                )
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(HttpMessageNotReadableException ex) {

        return ResponseEntity.badRequest().body(
                ApiResponse.error(
                        "Invalid request format",
                        new ApiResponse.ErrorDetail(
                                "INVALID_REQUEST",
                                "Request body is invalid or malformed"
                        )
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("Unexpected error: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiResponse.error("Internal server error",
                new ApiResponse.ErrorDetail("INTERNAL_ERROR", "An unexpected error occurred"))
        );
    }
}