package com.request;


import com.account.*;
import com.configuration.auth.jwt.JwtUtil;
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
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class RequestService {
    private final RequestRepository requestRepository ;
    private final AccountRepository accountRepository ;
    private final UserRepository userRepository;
    private  final  TransactionRepository transactionRepository;

    public RequestService(RequestRepository requestRepository , AccountRepository accountRepository,UserRepository userRepository ,TransactionRepository transactionRepository   ) {
        this.requestRepository = requestRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;

    }


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
    public  ReturnClass createRequest(UUID id ,String data , RequestType reqType){
        ReturnClass rs = new ReturnClass();



        UserRole role = checkRole();
        System.out.println("========================"+role.toString()+"===============");

        Account acc = accountRepository.findById(id).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );

        RequestModel req = new RequestModel();
        req.setCreatedAt(LocalDateTime.now());
        req.setData(data);
        req.setRequestType(reqType);
        req.setAccount(acc);



        if(role.equals(UserRole.ADMIN)){
            req.setStatus(StatusType.APPROVED);
            UserModel apv_by = userRepository.findById(UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName())).orElseThrow(() -> new TransactionError.AccountInvalid("Account not found") );

            req.setApproveBy(apv_by);
            req.setApprovedAt(LocalDateTime.now());
            String prefix ="DEPO";

            int count = transactionRepository.countTodayByType(prefix);

            String running = String.format("%04d", count + 1);
            String date = LocalDate.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            String refNo = prefix + date + running;
            TransactionModel tx = new TransactionModel();
            tx.setAmount(acc.getBalance());
            tx.setCreatedAt(LocalDateTime.now());
            tx.setFromAccount(
                    acc
            );

            tx.setStatus(StatusType.ACTIVE);
            tx.setNote("OPEN ACCOUNT");
            tx.setReferenceNo(refNo);
            tx.setTransaction_type(TransactionType.DEPOSIT);

            transactionRepository.save(tx);

            acc.setStatus(AccountStatus.ACTIVE);
            accountRepository.save(acc);
        }
        else if(role.equals(UserRole.CUSTOMER)){
            req.setStatus(StatusType.PENDING);
        }else{
            throw new AuthenError.InValidUserRole("User Unauthorized");
        }

        requestRepository.save(req);

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
            String prefix ="DEPO";

            int count = transactionRepository.countTodayByType(prefix);

            String running = String.format("%04d", count + 1);
            String date = LocalDate.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            String refNo = prefix + date + running;
            TransactionModel data = new TransactionModel();
            data.setAmount(acc.getBalance());
            data.setCreatedAt(LocalDateTime.now());
            data.setFromAccount(
                    acc
            );

            data.setStatus(StatusType.ACTIVE);
            data.setNote("OPEN ACCOUNT");
            data.setReferenceNo(refNo);
            data.setTransaction_type(TransactionType.DEPOSIT);

            transactionRepository.save(data);


        }else if (rq.getRequestType().equals(RequestType.CHANEG_ACCOUNT_TYPE)){

            acc.setAccountType(AccountType.valueOf(rq.getData()));
        }else if (rq.getRequestType().equals(RequestType.CHANGE_ACCOUNT_STATUS)){

            acc.setStatus(AccountStatus.valueOf(rq.getData()));
        }



        rq.setStatus(StatusType.APPROVED);
        requestRepository.save(rq);
        accountRepository.save(acc);
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
