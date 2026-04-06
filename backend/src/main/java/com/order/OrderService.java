package com.order;


import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.models.TransactionType;
import com.models.UserRole;
import com.order.dto.OrderDTO;
import com.portfolio.PortfolioModel;
import com.portfolio.PortfolioRepository;
import com.portfolioDetail.PortfolioDetailService;
import com.stock.StockModel;
import com.stock.StockRepository;
import com.stock.dto.StockDTO;
import com.transaction.TransactionService;
import com.transaction.dto.TransactionDTO;
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
    private final TransactionService transactionService;


    @Transactional
    public  ReturnClass createOrder(OrderDTO data){
      ReturnClass rs = new ReturnClass();

      OrderModel order = new OrderModel();
      order.setCreatedAt(LocalDateTime.now());
      order.setAmount(data.getAmount());
      order.setRemainingAmount(data.getAmount());
      order.setStatus(OrderStatus.PENDING);
      order.setType(data.getType());
      
      // Round to 2 decimal places to ensure exact refund matching
      order.setPrice(data.getPrice().setScale(2, java.math.RoundingMode.HALF_UP));

      UserRole role = checkRole();
//      if(role.equals(UserRole.ADMIN)){
//          order.setStatus(OrderStatus.OPEN);
//
//      }

      StockModel stock = stockRepository.findById(data.getSymbol()).orElseThrow(()->new RuntimeException("Stock Not found"));

      PortfolioModel port = portfolioRepository.findById(data.getPortfolioId()).orElseThrow(()->new RuntimeException("Portfolio Not found"));


      order.setPortfolio(port);
      order.setStock(stock);
      order.setAccountId(data.getAccountId());
      if(order.getType().equals(OrderType.BUY)){
          TransactionDTO rq = new TransactionDTO();
          rq.setNote("Buy"+ order.getAmount() +" Shares of " + order.getStock().getSymbol() );
          rq.setType(TransactionType.WITHDRAW);
          rq.setAmount(order.getAmount().multiply(order.getPrice()));
          rq.setFromAccountId(order.getAccountId());
          transactionService.createTransaction(rq);
      }

      OrderModel saved = orderRepository.save(order);

        if(role.equals(UserRole.ADMIN)){
           approveOrder(saved.getId() , true);

        }


      rs.setCODE("200");
      rs.setMSG("SAVE ORDER SUCCESS");

      return rs;
    }

    public ReturnDataClass<OrderDTO> getAllOrder (int page  , int size){
        ReturnDataClass<OrderDTO> rs = new ReturnDataClass<>();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<OrderModel> list = orderRepository.findAll( pageable);

        return  new ReturnDataClass<>(list.map(OrderDTO::fromEntity));
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
//                TransactionDTO rq = new TransactionDTO();
//                rq.setNote("Buy Share");
//                rq.setType(TransactionType.WITHDRAW);
//                rq.setAmount(order.getAmount().multiply(order.getPrice()));
//                rq.setFromAccountId(order.getAccountId());
//                transactionService.createTransaction(rq);
            }
            else if (order.getType().equals(OrderType.SELL)){
                portfolioDetailService.sellStock(order);
                TransactionDTO rq = new TransactionDTO();
                rq.setNote("Sell Share");
                rq.setType(TransactionType.DEPOSIT);
                rq.setAmount(order.getAmount().multiply(order.getPrice()));
                rq.setFromAccountId(order.getAccountId());
                transactionService.createTransaction(rq);
            }
        }else{
            order.setStatus(OrderStatus.CANCELLED);
            TransactionDTO rq = new TransactionDTO();
            rq.setNote("Refund Share");
            rq.setType(TransactionType.DEPOSIT);
            rq.setAmount(order.getAmount().multiply(order.getPrice()));
            rq.setFromAccountId(order.getAccountId());
            transactionService.createTransaction(rq);
        }


        orderRepository.save(order);


        rs.setCODE("200");
        rs.setMSG("APPROVE ORDER SUCCESS");

        return rs;
    }




}
