package com.order;


import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.models.UserRole;
import com.order.dto.OrderDTO;
import com.portfolio.PortfolioModel;
import com.portfolio.PortfolioRepository;
import com.portfolioDetail.PortfolioDetailService;
import com.stock.StockModel;
import com.stock.StockRepository;
import com.stock.dto.StockDTO;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

import static com.utility.UserLoginInfo.GetUserLoginId;
import static com.utility.UserLoginInfo.checkRole;

@Builder
@Service
@RequiredArgsConstructor
public class OrderService {

    @Autowired
    private final OrderRepository orderRepository ;
    private final StockRepository stockRepository ;
    private final PortfolioRepository portfolioRepository ;
    private final PortfolioDetailService portfolioDetailService;



    @Transactional
    public  ReturnClass createOrder(OrderDTO data){
      ReturnClass rs = new ReturnClass();

      OrderModel order = new OrderModel();
      order.setCreatedAt(LocalDateTime.now());
      order.setAmount(data.getAmount());
      order.setRemainingAmount(data.getAmount());
      order.setStatus(OrderStatus.PENDING);
      order.setType(data.getType());
      order.setPrice(data.getPrice());

      UserRole role = checkRole();
//      if(role.equals(UserRole.ADMIN)){
//          order.setStatus(OrderStatus.OPEN);
//
//      }

      StockModel stock = stockRepository.findById(data.getSymbol()).orElseThrow(()->new RuntimeException("Stock Not found"));

      PortfolioModel port = portfolioRepository.findById(data.getPortfolioId()).orElseThrow(()->new RuntimeException("Portfolio Not found"));


      order.setPortfolio(port);
      order.setStock(stock);

      OrderModel saved = orderRepository.save(order);

        if(role.equals(UserRole.ADMIN)){
           approveOrder(saved.getId() , true);

        }


      rs.setCODE("200");
      rs.setMSG("SAVE ORDER SUCCESS");

      return rs;
    }

    public ReturnDataClass<OrderDTO> getAllOrderByUser (int page  , int size){
        ReturnDataClass<OrderDTO> rs = new ReturnDataClass<>();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        System.out.println(GetUserLoginId());
        Page<OrderModel> list = orderRepository.findByPortfolio_User_Id(GetUserLoginId() , pageable);

        return  new ReturnDataClass<>(list.map(OrderDTO::fromEntity));
    }


    public  ReturnClass approveOrder(UUID orderId ,Boolean isApprove){
        ReturnClass rs = new ReturnClass();


        OrderModel order = orderRepository.findById(orderId).orElseThrow(()->new RuntimeException("Stock Not found"));

        if(isApprove){
            order.setStatus(OrderStatus.OPEN);
            if(order.getType().equals(OrderType.BUY)){
                portfolioDetailService.addStock(order);
            }
            else if (order.getType().equals(OrderType.SELL)){
                portfolioDetailService.sellStock(order);
            }
        }else{
            order.setStatus(OrderStatus.CANCELLED);
        }


        orderRepository.save(order);


        rs.setCODE("200");
        rs.setMSG("APPROVE ORDER SUCCESS");

        return rs;
    }




}
