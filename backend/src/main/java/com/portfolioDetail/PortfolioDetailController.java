package com.portfolioDetail;

import com.portfolio.PortfolioService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/portfolios/detai")
public class PortfolioDetailController {


    private final PortfolioService portfolioService ;

    public PortfolioDetailController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }


//    @GetMapping("")
//    public  ApiResponse<ReturnDataClass<RequestDTO>> getAllRequest(@RequestParam int page, @RequestParam int size){
//        ReturnDataClass<RequestDTO> rs =  requestService.getAllRequest(page , size);
//
//        return   ApiResponse.success("Get Success", rs);
//    }


//    @PostMapping("")
//    public ApiResponse<RequestDTO> postRequest(@RequestBody RequestDTO req) {
//
//
//        ReturnClass rs = requestService.createRequest( req.getAccountRequest() , req.getRequestType() );
//
//        return ApiResponse.success(rs.getMSG() , null);
//    }




}
