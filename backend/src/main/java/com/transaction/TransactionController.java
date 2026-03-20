package com.transaction;

import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.transaction.dto.TransactionDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private final TransactionService transactionService ;


    public TransactionController(TransactionService transactionService  ) {
        this.transactionService = transactionService;

    }




    @PostMapping("/transaction")
    public ApiResponse<List<TransactionDTO>> postTransaction(@RequestBody TransactionDTO req) {


        ReturnClass rs = transactionService.createTransaction(req);

        return ApiResponse.success(rs.getMSG() , null);
    }


    @GetMapping("/getHistory/{id}")
    public  ApiResponse<List<TransactionDTO>> getHistory(@PathVariable  UUID id){
        ReturnClass rs =  transactionService.getTransactionHistory(id);

        return   ApiResponse.success(rs.getMSG() , rs.getData().getTransactionList());
    }


}
