package com.portfolio;


import com.account.dto.AccountResponse;
import com.models.*;
import com.portfolio.dto.PortfolioDTO;
import com.portfolioDetail.PortfolioDetailModel;
import com.request.RequestType;
import com.user.UserModel;
import com.user.UserRepository;
import com.user.expception.AuthenError;
import com.user.expception.UserError;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.utility.UserLoginInfo.GetUserLoginId;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    @Autowired
    private final PortfolioRepository portfolioRepository ;
    private final UserRepository userRepository ;




    @Transactional
    public  ReturnClass createPortfolio(PortfolioDTO data){
      ReturnClass rs = new ReturnClass();

      UserModel owner = userRepository.findById(data.getUserId()).orElseThrow(UserError.UserNotFound::new);

      PortfolioModel port = new PortfolioModel();


      port.setReason(data.getReason());
      port.setUser(owner);
      port.setCreatedAt(LocalDateTime.now());
      port.setStatus(PortfolioStatus.ACTIVE);

      PortfolioModel savedPort = portfolioRepository.save(port);

      UUID id = savedPort.getId();

      savedPort.setAccountNumber(generateAccountNo(id));

      portfolioRepository.save(savedPort);

      rs.setMSG("Save Success");
      rs.setCODE("200");

      return rs;
    }

    @Value("${portfolio.encode.date}")
    private int enDateKey;


    public String generateAccountNo(UUID uuid) {

        long date = Long.parseLong(
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
        );
        long encodedDate = (date + enDateKey) % 100000000;

        String uuidStr = uuid.toString().replace("-", "");

        return String.format("%08d%s", encodedDate, uuidStr);
    }



    public  ReturnDataClass<PortfolioDTO> getPortfolioByUserId(){
        ReturnDataClass<PortfolioDTO>  rs = new ReturnDataClass<> ();

        UUID userId = GetUserLoginId();

        List<PortfolioModel> list = portfolioRepository.findByUser_Id(userId);

        List<PortfolioDTO> rsList = PortfolioDTO.fromEntityList(list);


        List<PortfolioDetailModel> detailList = new ArrayList<>();
        for(int i = 0 ; i < list.size() ; i++){

            for(int j = 0 ; j < list.get(i).getPortfolioDetails().size() ; j++){
                PortfolioDetailModel detail = new PortfolioDetailModel();

                detail.setStock(list.get(i).getPortfolioDetails().get(j).getStock());
                detail.setAvg_price(list.get(i).getPortfolioDetails().get(j).getAvg_price());
                detail.setAmount(list.get(i).getPortfolioDetails().get(j).getAmount());


                detailList.add(detail);

            }

            rsList.get(i).setDetails(detailList);
        }

        rs.setContent(rsList);

        return rs;
    }


}
