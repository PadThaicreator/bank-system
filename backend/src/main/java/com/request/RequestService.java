package com.request;


import com.account.*;
import com.account.dto.AccountResponse;
import com.account.dto.ChangeAccountTypeRequest;
import com.account.dto.ChangeStatusRequest;
import com.account.dto.CreateAccountRequest;
import com.models.*;
import com.portfolio.PortfolioService;
import com.portfolio.dto.PortfolioDTO;
import com.request.dto.RequestDTO;
import com.request.expception.RequestError;
import com.transaction.TransactionRepository;
import com.transaction.TransactionService;
import com.transaction.dto.TransactionDTO;
import com.transaction.expception.TransactionError;
import com.user.UserModel;
import com.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.utility.UserLoginInfo.checkRole;

@Service
@RequiredArgsConstructor
public class RequestService {
    private final RequestRepository requestRepository ;
    private final AccountRepository accountRepository ;
    private final UserRepository userRepository;
    private  final  TransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final AccountService accountService ;
    private final PortfolioService portfolioService ;
    @Autowired
    private ObjectMapper objectMapper;



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

        RequestModel req = new RequestModel();
        req.setCreatedAt(LocalDateTime.now());

        req.setRequestType(reqType);
        req.setStatus(StatusType.PENDING);
            if(reqType.equals(RequestType.OPEN_ACCOUNT)){


                CreateAccountRequest car = new CreateAccountRequest();
                car.setAccountType(acc.getAccountType());
                car.setInitialDeposit(acc.getBalance());

//                AccountResponse saved = accountService.createAccount(car);
//                Account rqAcc = accountRepository.findById(saved.getId()).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );
//                req.setAccount(rqAcc);
                req.setData(objectMapper.writeValueAsString(car));
            }
            else if (reqType.equals(RequestType.CHANGE_ACCOUNT_TYPE)){


//                req.setData(acc.getAccountType().toString());
                Account rqAcc = accountRepository.findById(acc.getId()).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );
                req.setData(objectMapper.writeValueAsString(acc));
                req.setAccount(rqAcc);
            }
            else if (reqType.equals(RequestType.CHANGE_ACCOUNT_STATUS)){
//                req.setData(acc.getStatus().toString());
                req.setData(objectMapper.writeValueAsString(acc));
                Account rqAcc = accountRepository.findById(acc.getId()).orElseThrow( () -> new TransactionError.AccountInvalid("Account not found") );
                req.setAccount(rqAcc);
            }
            else {
                throw new RequestError.RequestInvalid("Invalid Action");
            }


        RequestModel request = requestRepository.save(req);


        if(role.equals(UserRole.ADMIN)){
            System.out.println("=================ADMIN REQUEST===================");
            approveRequest(request.getId(),true);
        }

        return rs;
    }


    @Transactional
    public  ReturnClass approveRequest(UUID id , boolean isApprove){
        ReturnClass rs = new ReturnClass();
        RequestModel rq = requestRepository.findById(id).orElseThrow( () -> new RequestError.RequestInvalid("Request not found") );
        Account acc = new Account();
        if(!rq.getRequestType().equals(RequestType.OPEN_ACCOUNT)){
            acc = accountRepository.findById(rq.getAccount().getId()).orElseThrow(() -> new TransactionError.AccountInvalid("Account not found") );
        }
        UserModel apv_by = userRepository.findById(UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName())).orElseThrow(() -> new TransactionError.AccountInvalid("Account not found") );

        rq.setApprovedAt(LocalDateTime.now());
        rq.setApproveBy(apv_by);

        if(!isApprove){
            rq.setStatus(StatusType.REJECTED);


            requestRepository.save(rq);
            rs.setMSG("Rejected Success");
            return rs;
        }

        if(rq.getRequestType().equals(RequestType.OPEN_ACCOUNT)){

            CreateAccountRequest payload;
            payload = objectMapper.readValue(rq.getData(), CreateAccountRequest.class);

            AccountResponse accRes = accountService.createAccount(payload);

            TransactionDTO tx = new TransactionDTO();
            tx.setType(TransactionType.DEPOSIT);
            tx.setAmount(accRes.getBalance());
            tx.setFromAccountId(accRes.getId());
            tx.setNote("OPEN ACCOUNT");


            accountService.changeBalance(accRes.getId(), accRes.getBalance().negate());
            transactionService.createTransaction(tx);


        }else if (rq.getRequestType().equals(RequestType.CHANGE_ACCOUNT_TYPE)){

            ChangeAccountTypeRequest payload;
            payload = objectMapper.readValue(rq.getData(), ChangeAccountTypeRequest.class);
            accountService.changeAccountType(acc.getId() , payload);


        }else if (rq.getRequestType().equals(RequestType.CHANGE_ACCOUNT_STATUS)){



            ChangeStatusRequest payload;
            payload = objectMapper.readValue(rq.getData(), ChangeStatusRequest.class);


            accountService.changeAccountStatus(acc.getId() , payload);

        }



        rq.setStatus(StatusType.APPROVED);
        requestRepository.save(rq);

        rs.setMSG("Approved Success");
        return rs;
    }

    @Transactional
    public  ReturnClass createPortfolioRequest(PortfolioDTO portReq , RequestType requestType ){
        ReturnClass rs = new ReturnClass();
        RequestModel req = new RequestModel();

        UserRole role = checkRole();
        req.setCreatedAt(LocalDateTime.now());
        if(requestType.equals(RequestType.OPEN_PORTFOLIO)){
            req.setData(objectMapper.writeValueAsString(portReq));
            req.setStatus(StatusType.PENDING);
            req.setRequestType(RequestType.OPEN_PORTFOLIO);
        }

        RequestModel request = requestRepository.save(req);



        if(role.equals(UserRole.ADMIN)){
            System.out.println("=================ADMIN REQUEST===================");
            approvePortRequest(request.getId(),true);
        }

        return rs;
    }


    @Transactional
    public void approvePortRequest(UUID id , boolean isApprove){
        ReturnClass rs = new ReturnClass();
        RequestModel rq = requestRepository.findById(id).orElseThrow( () -> new RequestError.RequestInvalid("Request not found") );
        Account acc = new Account();

        UserModel apv_by = userRepository.findById(UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName())).orElseThrow(() -> new TransactionError.AccountInvalid("Account not found") );

        rq.setApprovedAt(LocalDateTime.now());
        rq.setApproveBy(apv_by);

        if(!isApprove){
            rq.setStatus(StatusType.REJECTED);


            requestRepository.save(rq);
            rs.setMSG("Rejected Success");
            return;
        }

        if(rq.getRequestType().equals(RequestType.OPEN_PORTFOLIO)){

            PortfolioDTO payload;
            payload = objectMapper.readValue(rq.getData(), PortfolioDTO.class);

            rs = portfolioService.createPortfolio(payload);



        }



        rq.setStatus(StatusType.APPROVED);
        requestRepository.save(rq);

        rs.setMSG("Approved Success");
    }







}
