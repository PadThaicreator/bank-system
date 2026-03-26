package com.request;


import com.account.*;
import com.account.dto.AccountResponse;
import com.account.dto.ChangeAccountTypeRequest;
import com.account.dto.ChangeStatusRequest;
import com.account.dto.CreateAccountRequest;
import com.models.*;
import com.request.dto.RequestDTO;
import com.request.expception.RequestError;
import com.transaction.TransactionModel;
import com.transaction.TransactionRepository;
import com.transaction.TransactionService;
import com.transaction.dto.TransactionDTO;
import com.transaction.expception.TransactionError;
import com.user.UserModel;
import com.user.UserRepository;
import com.user.expception.AuthenError;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestService {
    private final RequestRepository requestRepository ;
    private final AccountRepository accountRepository ;
    private final UserRepository userRepository;
    private  final  TransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final AccountService accountService ;



    public  ReturnDataClass<RequestDTO> getAllRequest(int page , int size){
        ReturnDataClass<RequestDTO> rsData = new ReturnDataClass<>();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RequestModel> rqList = requestRepository.findAll(pageable);




        List<RequestDTO> returnList = RequestDTO.fromEntityList(rqList.getContent());

        rsData.setTotalElements(rqList.getTotalElements());
        rsData.setTotalPages(rqList.getTotalPages());
        rsData.setCurrentPage(rqList.getNumber());
        rsData.setPageSize(rqList.getSize());
        rsData.setFirst(rqList.isFirst());
        rsData.setLast(rqList.isLast());
        rsData.setContent(returnList);




        return rsData;
    }

    @Transactional
    public  ReturnClass createRequest(AccountResponse acc , RequestType reqType){
        ReturnClass rs = new ReturnClass();



        UserRole role = checkRole();
//        System.out.println("========================"+role.toString()+"===============");

//        Account acc = accountRepository.findById(id).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );

        RequestModel req = new RequestModel();
        req.setCreatedAt(LocalDateTime.now());
//        req.setData("OPEN ACCOUNT BY ADMIN");

        req.setRequestType(reqType);
            req.setStatus(StatusType.PENDING);
            if(reqType.equals(RequestType.OPEN_ACCOUNT)){


                CreateAccountRequest car = new CreateAccountRequest();
                car.setAccountType(acc.getAccountType());
                car.setInitialDeposit(acc.getBalance());

                AccountResponse saved = accountService.createAccount(car);
                Account rqAcc = accountRepository.findById(saved.getId()).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );
                req.setAccount(rqAcc);
//                req.setId(saved.getId());
                req.setData("OPEN ACCOUNT");
            }
            else if (reqType.equals(RequestType.CHANGE_ACCOUNT_TYPE)){
                req.setData(acc.getAccountType().toString());
                Account rqAcc = accountRepository.findById(acc.getId()).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );
                req.setAccount(rqAcc);
            }
            else if (reqType.equals(RequestType.CHANGE_ACCOUNT_STATUS)){
                req.setData(acc.getStatus().toString());
                Account rqAcc = accountRepository.findById(acc.getId()).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );
                req.setAccount(rqAcc);
            }
            else {
                throw new RequestError.RequestInvalid("Invalid Action");
            }


        RequestModel request = requestRepository.save(req);


        if(role.equals(UserRole.ADMIN)){
            System.out.println("================="+request.getId()+"===================");
            approveRequest(request.getId(),true);
        }

        return rs;
    }

    @Transactional
    public  ReturnClass approveRequest(UUID id , boolean isApprove){
        ReturnClass rs = new ReturnClass();
        RequestModel rq = requestRepository.findById(id).orElseThrow( () -> new RequestError.RequestInvalid("Account not found") );
        Account acc = accountRepository.findById(rq.getAccount().getId()).orElseThrow(() -> new TransactionError.AccountInvalid("Account not found") );

        UserModel apv_by = userRepository.findById(UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName())).orElseThrow(() -> new TransactionError.AccountInvalid("Account not found") );

        rq.setApprovedAt(LocalDateTime.now());
        rq.setApproveBy(apv_by);

        if(!isApprove){
            rq.setStatus(StatusType.REJECTED);

            if(rq.getRequestType().equals(RequestType.OPEN_ACCOUNT)){
                acc.setStatus(AccountStatus.REJECTED_REQUEST);
                accountRepository.save(acc);
            }

            requestRepository.save(rq);
            rs.setMSG("Rejected Success");
            return rs;
        }

        if(rq.getRequestType().equals(RequestType.OPEN_ACCOUNT)){

            acc.setStatus(AccountStatus.ACTIVE);


            TransactionDTO tx = new TransactionDTO();
            tx.setType(TransactionType.DEPOSIT);
            tx.setAmount(acc.getBalance());
            tx.setFromAccountId(acc.getId());
            tx.setNote("OPEN ACCOUNT");

            accountService.changeBalance(acc.getId(), acc.getBalance().negate());
            transactionService.createTransaction(tx);


        }else if (rq.getRequestType().equals(RequestType.CHANGE_ACCOUNT_TYPE)){

            ChangeAccountTypeRequest cat = new ChangeAccountTypeRequest();
            cat.setAccountType(rq.getData());
            accountService.changeAccountType(acc.getId() , cat);


        }else if (rq.getRequestType().equals(RequestType.CHANGE_ACCOUNT_STATUS)){

            ChangeStatusRequest csr = new ChangeStatusRequest();
            csr.setStatus(AccountStatus.valueOf(rq.getData()));
            accountService.changeAccountStatus(acc.getId() , csr);

        }



        rq.setStatus(StatusType.APPROVED);
        requestRepository.save(rq);

        rs.setMSG("Approved Success");
        return rs;
    }


    private UserRole checkRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized: No authentication found");
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority())||UserRole.ADMIN.name().equals(a.getAuthority()));

        return isAdmin ? UserRole.ADMIN : UserRole.CUSTOMER;
    }




}
