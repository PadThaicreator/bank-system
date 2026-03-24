package com.transaction;

import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.transaction.dto.TransactionDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService ;


    public TransactionController(TransactionService transactionService  ) {
        this.transactionService = transactionService;

    }




    @PostMapping("")
    public ApiResponse<List<TransactionDTO>> postTransaction(@RequestBody TransactionDTO req) {


        ReturnClass rs = transactionService.createTransaction(req);

        return ApiResponse.success(rs.getMSG() , null);
    }


    @GetMapping("/history/{accNum}")
    public  ApiResponse<List<TransactionDTO>> getHistory(@PathVariable  UUID accNum){
        ReturnClass rs =  transactionService.getTransactionHistory(accNum);

        return   ApiResponse.success(rs.getMSG() , rs.getData().getTransactionList());
    }


    @GetMapping("")
    public  ApiResponse<List<TransactionDTO>> getAllTransaction(){
        ReturnClass rs =  transactionService.getAllTransaction();

        return   ApiResponse.success(rs.getMSG() , rs.getData().getTransactionList());
    }

    @GetMapping("/user")
    public  ApiResponse<List<TransactionDTO>> getTransactionByUserId(){
        ReturnClass rs =  transactionService.getTransactionByUserId();

        return   ApiResponse.success(rs.getMSG() , rs.getData().getTransactionList());
    }


}
