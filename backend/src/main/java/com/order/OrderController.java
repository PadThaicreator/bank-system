package com.order;

import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.order.dto.OrderDTO;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/orders")
public class OrderController {


    private final OrderService orderService ;

    public OrderController( OrderService orderService) {
        this.orderService = orderService;

    }


    @GetMapping("")
    public  ApiResponse<ReturnDataClass<OrderDTO>> getAllOrder( @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size){
        ReturnDataClass<OrderDTO> rs =  orderService.getAllOrder(page , size);

        return   ApiResponse.success("Get Success", rs);
    }

    @GetMapping("/user")
    public  ApiResponse<ReturnDataClass<OrderDTO>> getAllOrderByUserId( @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size){
        ReturnDataClass<OrderDTO> rs =  orderService.getAllOrderByUser(page , size);

        return   ApiResponse.success("Get Success", rs);
    }



    @PostMapping("")
    public ApiResponse<ReturnClass> createOrder(@RequestBody OrderDTO order) {


        ReturnClass rs = orderService.createOrder( order);

        return ApiResponse.success(rs.getMSG() , null);
    }


    @PutMapping("/{id}")
    public ApiResponse<ReturnClass> approveOrder(@PathVariable UUID id ,
                                                 @RequestParam Boolean isApprove) {


        ReturnClass rs = orderService.approveOrder(id , isApprove);

        return ApiResponse.success(rs.getMSG() , null);
    }




}
