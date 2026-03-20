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


    public TransactionService(TransactionRepository transactionRepository , AccountRepository accountRepository ) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;

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

                fromAccount.setBalance(fromBalance.add(amount));
                accountRepository.save(fromAccount);
                data.setTransaction_type(TransactionType.DEPOSIT);

            }
            else if (type.equals("WITHDRAW")) {

                if (fromBalance.compareTo(amount) < 0) {
                    throw new TransactionError.InsufficientBalance("Insufficient balance");
                }
                data.setTransaction_type(TransactionType.WITHDRAW);
                fromAccount.setBalance(fromBalance.subtract(amount));
                accountRepository.save(fromAccount);

            }
            else if (type.equals("TRANSFER")) {

                if (fromBalance.compareTo(amount) < 0) {
                    throw new TransactionError.InsufficientBalance("Insufficient balance");
                }

                fromAccount.setBalance(fromBalance.subtract(amount));
                toAccount.setBalance(toAccount.getBalance().add(amount));
                data.setTransaction_type(TransactionType.TRANSFER);
                accountRepository.save(fromAccount);
                accountRepository.save(toAccount);
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
            data.setCreated_at(LocalDateTime.now());
            data.setFromAccountId(
                    req.getFromAccountId() != null
                            ? req.getFromAccountId()
                            : null
            );

            data.setToAccountId(
                    toAccountId != null
                            ? toAccountId
                            : null
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


    public ReturnClass getTransactionHistory(UUID accNum){


        ReturnClass rs = new ReturnClass();
        ReturnDataClass rsData = new ReturnDataClass();
        List<TransactionModel> transactionList =  transactionRepository.findByFromAccountIdOrToAccountId(accNum,accNum);

        List<TransactionDTO> returnList = new ArrayList<>();
        for(int i = 0 ; i < transactionList.size()  ; i++){
            TransactionDTO data = new TransactionDTO();
            data.setAmount(transactionList.get(i).getAmount());
            data.setNote(transactionList.get(i).getNote());
            data.setType(transactionList.get(i).getTransaction_type());
            data.setReferenceNo(transactionList.get(i).getReferenceNo());
            data.setToAccountId(transactionList.get(i).getToAccountId());
            data.setFromAccountId(transactionList.get(i).getFromAccountId());

            Account fromAcc = accountRepository.findById(data.getFromAccountId()).orElseThrow(()-> new TransactionError.AccountInvalid("From Account not found") );

            data.setFromAccountNumber(fromAcc.getAccountNumber());

            if(data.getType().equals(TransactionType.TRANSFER)){
                Account toAcc = accountRepository.findById(data.getToAccountId()).orElseThrow(()-> new TransactionError.AccountInvalid("To Account not found") );

                data.setToAccountNumber(toAcc.getAccountNumber());
            }
            returnList.add(data);
        }
        rsData.setTransactionList(returnList);
        rs.setSuccessReturn();
        rs.setCODE("200");
        rs.setMSG("Get Success");
        rs.setData(rsData);

        return  rs;
    }

    public ReturnClass getAllTransaction(){


        ReturnClass rs = new ReturnClass();
        ReturnDataClass rsData = new ReturnDataClass();
        List<TransactionDTO> transactionList =  TransactionDTO.fromEntityList(transactionRepository.findAll());
        rsData.setTransactionList(transactionList);
        rs.setSuccessReturn();
        rs.setCODE("200");
        rs.setMSG("GET SUCCESS");
        rs.setData(rsData);

        return  rs;
    }



}
