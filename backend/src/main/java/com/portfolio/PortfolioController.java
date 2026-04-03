package com.portfolio;

import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.portfolio.dto.PortfolioDTO;
import com.request.RequestService;
import com.request.dto.RequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/portfolios")
public class PortfolioController {


    private final PortfolioService portfolioService ;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }


    @GetMapping("/user")
    public  ApiResponse<ReturnDataClass<PortfolioDTO>> getPortfolioByUserId(){
        ReturnDataClass<PortfolioDTO> rs =  portfolioService.getPortfolioByUserId();

        return   ApiResponse.success("Get Success", rs);
    }


//    @PostMapping("")
//    public ApiResponse<RequestDTO> postRequest(@RequestBody RequestDTO req) {
//
//
//        ReturnClass rs = requestService.createRequest( req.getAccountRequest() , req.getRequestType() );
//
//        return ApiResponse.success(rs.getMSG() , null);
//    }




}
