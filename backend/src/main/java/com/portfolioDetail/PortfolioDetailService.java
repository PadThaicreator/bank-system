package com.portfolioDetail;


import com.models.ReturnClass;
import com.order.OrderModel;
import com.portfolio.PortfolioModel;
import com.portfolio.PortfolioRepository;
import com.portfolio.PortfolioStatus;
import com.portfolio.dto.PortfolioDTO;
import com.stock.StockRepository;
import com.user.UserModel;
import com.user.UserRepository;
import com.user.expception.UserError;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PortfolioDetailService {

    @Autowired
    private final PortfolioRepository portfolioRepository ;
    private final StockRepository stockRepository ;
    private final PortfolioDetailRepository portfolioDetailRepository ;




    @Transactional
    public  ReturnClass addStock(OrderModel order){

      ReturnClass rs = new ReturnClass();

      PortfolioDetailModel data = new PortfolioDetailModel();

      if(portfolioDetailRepository.existsByPortfolio_IdAndStock_Symbol( order.getPortfolio().getId(),order.getStock().getSymbol())){
          PortfolioDetailModel detail = portfolioDetailRepository.findByPortfolio_IdAndStock_Symbol(order.getPortfolio().getId() ,order.getStock().getSymbol());

          BigDecimal oldAvg = detail.getAvg_price();
          BigDecimal oldAmount = detail.getAmount();

          BigDecimal newPrice = order.getPrice();
          BigDecimal newAmount = order.getAmount();

          BigDecimal oldValue = oldAvg.multiply(oldAmount);
          BigDecimal newValue = newPrice.multiply(newAmount);

          BigDecimal totalValue = oldValue.add(newValue);
          BigDecimal totalAmount = oldAmount.add(newAmount);


          BigDecimal newAvg = totalValue.divide(totalAmount, 2, RoundingMode.HALF_UP);


          detail.setAvg_price(newAvg);
          detail.setAmount(totalAmount);
          detail.setUpdatedAt(LocalDateTime.now());
          data = detail;
      }else{
          data.setPortfolio(order.getPortfolio());
          data.setStock(order.getStock());
          data.setAvg_price(order.getPrice());
          data.setAmount(order.getAmount());
          data.setCreatedAt(LocalDateTime.now());

      }

      portfolioDetailRepository.save(data);




      return rs;
    }


    @Transactional
    public  ReturnClass sellStock(OrderModel order){

        ReturnClass rs = new ReturnClass();

        PortfolioDetailModel detail = portfolioDetailRepository.findByPortfolio_IdAndStock_Symbol(order.getPortfolio().getId() ,order.getStock().getSymbol());

        BigDecimal currentAmount = detail.getAmount();
        BigDecimal sellAmount = order.getAmount();

        if (currentAmount.compareTo(sellAmount) < 0) {
            throw new RuntimeException("Stock Not Enough");
        }

        BigDecimal newAmount = currentAmount.subtract(sellAmount);

        detail.setAmount(newAmount);


        portfolioDetailRepository.save(detail);




        return rs;
    }


}
