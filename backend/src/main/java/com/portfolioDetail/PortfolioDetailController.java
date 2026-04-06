package com.portfolioDetail;

import com.configuration.common.response.ApiResponse;
import com.portfolio.PortfolioService;
import com.portfolioDetail.dto.PortfolioDetailDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;


@RestController
@RequestMapping("/portfolios/detail")
public class PortfolioDetailController {


    private final PortfolioDetailService portfolioDetailService ;

    public PortfolioDetailController(PortfolioDetailService portfolioDetailService) {
        this.portfolioDetailService = portfolioDetailService;

    }


    @GetMapping("")
    public  ApiResponse<PortfolioDetailDTO> getAllRequest(@RequestParam UUID portfolioId, @RequestParam String symbol){
        PortfolioDetailDTO rs =  portfolioDetailService.getStockInPortfolio(portfolioId , symbol);

        return   ApiResponse.success("Get Detail Success", rs);
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
