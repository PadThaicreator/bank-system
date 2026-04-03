package com.request;

import com.account.Account;
import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.portfolio.dto.PortfolioDTO;
import com.request.dto.RequestDTO;
import com.transaction.TransactionService;
import com.transaction.dto.TransactionDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/requests")
public class RequestController {

    private final RequestService requestService ;


    public RequestController(RequestService requestService  ) {
        this.requestService = requestService;

    }



    @GetMapping("")
    public  ApiResponse<ReturnDataClass<RequestDTO>> getAllRequest(@RequestParam int page, @RequestParam int size){
        ReturnDataClass<RequestDTO> rs =  requestService.getAllRequest(page , size);

        return   ApiResponse.success("Get Success", rs);
    }


    @PostMapping("")
    public ApiResponse<RequestDTO> postRequest(@RequestBody RequestDTO req) {


        ReturnClass rs = requestService.createRequest( req.getAccountRequest() , req.getRequestType() );

        return ApiResponse.success(rs.getMSG() , null);
    }






    @PutMapping("/{id}")
    public  ApiResponse<ReturnClass> approveRequest(@PathVariable  UUID id , @RequestParam Boolean isApprove ){
        ReturnClass rs =  requestService.approveRequest(id , isApprove);

        return   ApiResponse.success(rs.getMSG(), null);
    }

    @PostMapping("/portfolio")
    public ApiResponse<RequestDTO> postPortfolioRequest(@RequestBody PortfolioDTO req , @RequestParam RequestType type) {


        ReturnClass rs = requestService.createPortfolioRequest( req , type );

        return ApiResponse.success(rs.getMSG() , null);
    }


    @PutMapping("/portfolio/{id}")
    public  ApiResponse<ReturnClass> approvePortRequest(@PathVariable  UUID id , @RequestParam Boolean isApprove ){
        requestService.approvePortRequest(id , isApprove);

        return   ApiResponse.success("SUCCESS", null);
    }



}
