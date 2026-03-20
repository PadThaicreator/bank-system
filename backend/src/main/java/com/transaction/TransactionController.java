package com.transaction;

import com.account.AccountRepository;
import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private final TransactionService transactionService ;


    public TransactionController(TransactionService transactionService  ) {
        this.transactionService = transactionService;

    }




    @PostMapping("/transaction")
    public ApiResponse<ReturnDataClass> postTransaction(@RequestBody TransactionDTO req) {

        ReturnClass rs = new ReturnClass();
        rs = transactionService.createTransaction(req);

        return ApiResponse.success(rs.getMSG() , rs.getData());
    }


    @GetMapping("/getHistory/{id}")
    public  ApiResponse<ReturnDataClass> getHistory(@PathVariable  UUID id){
        ReturnClass rs =  transactionService.getTransactionHistory(id);

        return   ApiResponse.success(rs.getMSG() , rs.getData());
    }


}
