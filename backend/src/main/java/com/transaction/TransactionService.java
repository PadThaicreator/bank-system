package com.transaction;


import com.account.AccountService;
import com.account.dto.AccountResponse;
import com.account.dto.UserAccountResponse;
import com.models.StatusType;
import com.models.TransactionType;
import com.transaction.dto.TransactionDTO;
import com.transaction.expception.TransactionError;
import com.account.Account;
import com.account.AccountRepository;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.user.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository ;
    private final AccountRepository accountRepository ;
    private final AccountService    accountService;


    public TransactionService(TransactionRepository transactionRepository , AccountRepository accountRepository , AccountService    accountService) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.accountService = accountService;

    }

    @Transactional
    public  ReturnClass createTransaction(TransactionDTO req){
        ReturnClass rs = new ReturnClass();
        TransactionModel data = new TransactionModel();


            if (req.getType() == null ) {
//                System.out.println("==========================================================================================");

                throw new TransactionError.TypeRequired();
            }

            String type = req.getType().toString();
            UUID fromAccountId;
            UUID toAccountId = null;

            Account fromAccount = null;
            Account toAccount = null;


            if (type.equals("DEPOSIT") || type.equals("WITHDRAW")) {

                if (req.getFromAccountId() == null || req.getFromAccountId().toString().isBlank()) {
                    throw new TransactionError.AccountInvalid("From Account is required");
                }

                fromAccountId = req.getFromAccountId();

                fromAccount = accountRepository.findById(fromAccountId)
                        .orElseThrow(() -> new TransactionError.AccountInvalid("Invalid Account"));

            }
            else if (type.equals("TRANSFER")) {

                if (req.getFromAccountId() == null || req.getToAccountNumber() == null || req.getToAccountNumber().isEmpty() || req.getFromAccountId().toString().isEmpty() ) {
                    throw new TransactionError.AccountInvalid("Accounts are required");
                }
                Account toAcc = accountRepository.findByAccountNumber(req.getToAccountNumber()).orElseThrow(() -> new TransactionError.AccountInvalid("Invalid Transfer Account"));
                fromAccountId = req.getFromAccountId();
                toAccountId = toAcc.getId();

                fromAccount = accountRepository.findById(fromAccountId)
                        .orElseThrow(() -> new TransactionError.AccountInvalid("From Account not found"));

                toAccount = accountRepository.findById(toAccountId)
                        .orElseThrow(() -> new TransactionError.AccountInvalid("To Account not found"));
            }
            else {
                throw new TransactionError.TypeRequired();
            }

            BigDecimal amount = req.getAmount();

            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new TransactionError.InsufficientBalance("Invalid amount");
            }

            BigDecimal fromBalance = fromAccount.getBalance();

            if (type.equals("DEPOSIT")) {
//                fromAccount.setBalance(fromBalance.add(amount));
//                accountRepository.save(fromAccount);

                accountService.changeBalance(fromAccount.getId(),amount);
                data.setTransaction_type(TransactionType.DEPOSIT);

            }
            else if (type.equals("WITHDRAW")) {

                if (fromBalance.compareTo(amount) < 0) {
                    throw new TransactionError.InsufficientBalance("Insufficient balance");
                }
                data.setTransaction_type(TransactionType.WITHDRAW);
//                fromAccount.setBalance(fromBalance.subtract(amount));
//                accountRepository.save(fromAccount);
                accountService.changeBalance(fromAccount.getId(),amount.negate());

            }
            else if (type.equals("TRANSFER")) {

                if (fromBalance.compareTo(amount) < 0) {
                    throw new TransactionError.InsufficientBalance("Insufficient balance");
                }

//                fromAccount.setBalance(fromBalance.subtract(amount));
//                toAccount.setBalance(toAccount.getBalance().add(amount));
                data.setTransaction_type(TransactionType.TRANSFER);
                accountService.changeBalance(fromAccount.getId(),amount.negate());
                accountService.changeBalance(toAccount.getId(),amount);
//                accountRepository.save(fromAccount);
//                accountRepository.save(toAccount);
            }



            String prefix = switch (type) {
                case "DEPOSIT" -> "DEPO";
                case "WITHDRAW" -> "WITH";
                case "TRANSFER" -> "TRAN";
                default -> throw new TransactionError.TypeRequired();
            };

            int count = transactionRepository.countTodayByType(prefix);

            String running = String.format("%04d", count + 1);
            String date = LocalDate.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            String refNo = prefix + date + running;




            data.setAmount(amount);
            data.setCreatedAt(LocalDateTime.now());
            data.setFromAccount(
                    fromAccount
            );

            data.setToAccount(
                   toAccount
            );
            data.setStatus(StatusType.ACTIVE);
            data.setNote(req.getNote());
            data.setReferenceNo(refNo);

            transactionRepository.save(data);

            rs.setCODE("200");
            rs.setMSG("Transaction Success");
//            return ApiResponse.success("Transaction Success" , null);



        return rs;
    }


    public ReturnDataClass<TransactionDTO> getTransactionHistory(UUID accNum , int page , int size){

        ReturnDataClass<TransactionDTO> rsData = new ReturnDataClass<>();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<TransactionModel> transactionList =  transactionRepository.findByFromAccountIdOrToAccountId(accNum,accNum,pageable);

        List<TransactionDTO> returnList = transactionList.getContent()
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();

        rsData.setTotalElements(transactionList.getTotalElements());
        rsData.setTotalPages(transactionList.getTotalPages());
        rsData.setCurrentPage(transactionList.getNumber());
        rsData.setPageSize(transactionList.getSize());
        rsData.setFirst(transactionList.isFirst());
        rsData.setLast(transactionList.isLast());

        rsData.setTransactionList(returnList);


        return  rsData;
    }

    public ReturnClass getAllTransaction(){

        ReturnClass rs = new ReturnClass();
        ReturnDataClass<TransactionDTO> rsData = new ReturnDataClass<>();
        List<TransactionDTO> transactionList =  TransactionDTO.fromEntityList(transactionRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
        rsData.setTransactionList(transactionList);
        rs.setSuccessReturn();
        rs.setCODE("200");
        rs.setMSG("GET SUCCESS");
        rs.setData(rsData);

        return  rs;
    }


    public ReturnDataClass<TransactionDTO> getTransactionByUserId(int page , int size){
        UUID userIdStr = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());

        Pageable pageable = PageRequest.of(page, size);
        ReturnClass rs = new ReturnClass();
        ReturnDataClass<TransactionDTO> rsData = new ReturnDataClass<>();
        Page<TransactionModel> transactionList =  transactionRepository.findUserTransactionsNative(userIdStr , pageable);

        List<TransactionDTO> list = transactionList.getContent()
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();
        rsData.setTransactionList(list);
        rsData.setTotalElements(transactionList.getTotalElements());
        rsData.setTotalPages(transactionList.getTotalPages());
        rsData.setCurrentPage(transactionList.getNumber());
        rsData.setPageSize(transactionList.getSize());
        rsData.setFirst(transactionList.isFirst());
        rsData.setLast(transactionList.isLast());




        return  rsData;
    }



}
