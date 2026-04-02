package com.stock;

import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.transaction.TransactionService;
import com.transaction.dto.TransactionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/stocks")
public class StockController {

    @Autowired
    private final StockService stockService ;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }


    @PostMapping("")
    public ApiResponse<List<StockModel>> importStock() {


        stockService.importStock();

        return ApiResponse.success("SUCCESS" , null);
    }



}
