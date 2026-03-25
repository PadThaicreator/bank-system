package com.transaction;

import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.transaction.dto.TransactionDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;

    }

    @PostMapping("")
    public ApiResponse<List<TransactionDTO>> postTransaction(@RequestBody TransactionDTO req) {

        ReturnClass rs = transactionService.createTransaction(req);

        return ApiResponse.success(rs.getMSG(), null);
    }


    @GetMapping("/history/{accNum}")
    public  ApiResponse<ReturnDataClass<TransactionDTO>> getHistory(@PathVariable  UUID accNum,
                                                         @RequestParam int page,
                                                         @RequestParam int size){
        ReturnDataClass<TransactionDTO> rs =  transactionService.getTransactionHistory(accNum , page,size);

        return   ApiResponse.success("get history success" , rs);
    }


    @GetMapping("")
    public  ApiResponse<List<TransactionDTO>> getAllTransaction(){
        ReturnClass rs =  transactionService.getAllTransaction();

        return ApiResponse.success(rs.getMSG(), rs.getData().getTransactionList());
    }

    @GetMapping("/user")
    public ApiResponse<ReturnDataClass<TransactionDTO>> getTransactionByUserId(@RequestParam int page, @RequestParam int size){
        ReturnDataClass<TransactionDTO> rs =  transactionService.getTransactionByUserId(page,size);

        return   ApiResponse.success( "Get Transaction Success" , rs);
    }


}
