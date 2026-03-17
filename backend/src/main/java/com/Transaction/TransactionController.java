package com.Transaction;

import com.dtos.ReturnClass;
import com.models.AccountModel;
import com.models.UserModel;
import com.repositories.AccountRepository;
import com.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

@RestController
public class TransactionController {

    private final TransactionRepository transactionRepository ;
    private final AccountRepository accountRepository ;

    public TransactionController(TransactionRepository transactionRepository ,AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }



    @Transactional
    @PostMapping("/transaction")
    public ReturnClass register(@RequestBody TransactionDTO req) {

        ReturnClass rs = new ReturnClass();
        TransactionModel data = new TransactionModel();
        try {

            if (req.getType() == null) {
                throw new RuntimeException("Transaction type is required");
            }

            String type = req.getType();
            UUID fromAccountId;
            UUID toAccountId = null;

            AccountModel fromAccount = null;
            AccountModel toAccount = null;

            // =============================
            // LOAD ACCOUNT ตามประเภท
            // =============================

            if (type.equals("DEPOSIT") || type.equals("WITHDRAW")) {

                if (req.getFrom_account() == null || req.getFrom_account().isBlank()) {
                    throw new RuntimeException("From account is required");
                }

                fromAccountId = UUID.fromString(req.getFrom_account());

                fromAccount = accountRepository.findById(fromAccountId)
                        .orElseThrow(() -> new RuntimeException("Account not found"));

            }
            else if (type.equals("TRANSFER")) {

                if (req.getFrom_account() == null || req.getTo_account() == null) {
                    throw new RuntimeException("Both accounts are required");
                }

                fromAccountId = UUID.fromString(req.getFrom_account());
                toAccountId = UUID.fromString(req.getTo_account());

                fromAccount = accountRepository.findById(fromAccountId)
                        .orElseThrow(() -> new RuntimeException("From Account not found"));

                toAccount = accountRepository.findById(toAccountId)
                        .orElseThrow(() -> new RuntimeException("To Account not found"));
            }
            else {
                throw new RuntimeException("Invalid transaction type");
            }

            Float amount = req.getAmount();

            if (amount == null || amount <= 0) {
                throw new RuntimeException("Invalid amount");
            }

            Float fromBalance = fromAccount.getBalance();

            // =============================
            // PROCESS TRANSACTION
            // =============================

            if (type.equals("DEPOSIT")) {

                fromAccount.setBalance(fromBalance + amount);
                accountRepository.save(fromAccount);
                data.setTransaction_type(TransactionModel.Transaction.DEPOSIT);

            }
            else if (type.equals("WITHDRAW")) {

                if (fromBalance < amount) {
                    throw new RuntimeException("Insufficient balance");
                }
                data.setTransaction_type(TransactionModel.Transaction.WITHDRAW);
                fromAccount.setBalance(fromBalance - amount);
                accountRepository.save(fromAccount);

            }
            else if (type.equals("TRANSFER")) {

                if (fromBalance < amount) {
                    throw new RuntimeException("Insufficient balance");
                }

                fromAccount.setBalance(fromBalance - amount);
                toAccount.setBalance(toAccount.getBalance() + amount);
                data.setTransaction_type(TransactionModel.Transaction.TRANSFER);
                accountRepository.save(fromAccount);
                accountRepository.save(toAccount);
            }

            // =============================
            // GENERATE REF NO
            // =============================

            String prefix = switch (type) {
                case "DEPOSIT" -> "DEPO";
                case "WITHDRAW" -> "WITH";
                case "TRANSFER" -> "TRAN";
                default -> throw new RuntimeException("Invalid type");
            };

            int count = transactionRepository.countTodayByType(prefix);

            String running = String.format("%04d", count + 1);
            String date = LocalDate.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            String refNo = prefix + date + running;




            data.setAmount(amount);
            data.setCreated_at(LocalDateTime.now());
            data.setFrom_account_id(
                    req.getFrom_account() != null
                            ? UUID.fromString(req.getFrom_account())
                            : null
            );

            data.setTo_account_id(
                    req.getTo_account() != null
                            ? UUID.fromString(req.getTo_account())
                            : null
            );
            data.setStatus(TransactionModel.Status.ACTIVE);
            data.setNote(req.getNote());
            data.setReference_no(refNo);

            transactionRepository.save(data);

            rs.setCODE("200");
            rs.setMSG("Transaction Success");

        } catch (Exception e) {

            rs.setCODE("400");
            rs.setMSG(e.getMessage());
        }

        return rs;
    }


}
