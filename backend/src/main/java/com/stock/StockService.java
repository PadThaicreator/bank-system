package com.stock;



import com.models.ReturnDataClass;
import com.stock.dto.ProfileCompanyResponse;
import com.stock.dto.StockDTO;
import com.stock.dto.StockPriceDTO;
import com.stock.dto.StockPriceResponse;
import com.transaction.dto.TransactionDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
public class StockService {
    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${finnhub.api.key}")
    private String apiKey;


    private final String finnhubURL = "https://finnhub.io/api/v1";


    @Transactional
    public void importStock() {


        String url = finnhubURL+"/stock/symbol?exchange=US&token=" + apiKey;

        List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

        if (response == null) return;

        List<StockModel> batch = new ArrayList<>();
        int count = 0;

        for (Map<String, Object> item : response) {

            String type = (String) item.get("type");


            if (type == null || !type.equalsIgnoreCase("Common Stock")) {
                continue;
            }


            String symbol = (String) item.get("symbol");
            String name = (String) item.get("description");

            StockModel stock = new StockModel();
            stock.setSymbol(symbol);

            stock.setType("Common Stock");

            String profileUrl = finnhubURL + "/stock/profile2?symbol="+symbol+"&token=" + apiKey;

            ResponseEntity<ProfileCompanyResponse> profileRes = restTemplate.getForEntity(profileUrl, ProfileCompanyResponse.class);

            ProfileCompanyResponse stockResponse = profileRes.getBody();
            stock.setName(stockResponse.getName());
            stock.setIndustry(stockResponse.getFinnhubIndustry());
            stock.setLogo(stockResponse.getLogo());
            stock.setMarketCap(stockResponse.getMarketCapitalization());


            batch.add(stock);
            count++;

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // สำคัญ!
                throw new RuntimeException(e);
            }
            if (count >= 200) break;
        }

        stockRepository.saveAll(batch);

    }


    public StockPriceDTO getStockPrice(String symbol){

        String priceUrl = finnhubURL + "/quote?symbol="+symbol+"&token="+apiKey;
        ResponseEntity<StockPriceResponse> priceRes = restTemplate.getForEntity(priceUrl, StockPriceResponse.class);

        StockPriceResponse p = priceRes.getBody();
        StockPriceDTO price = StockPriceDTO.from(p);

        return price;

    }

    public ReturnDataClass<StockDTO> getAllStock(int page , int size){


        Pageable pageable = PageRequest.of(page, size, Sort.by("symbol").ascending());
        Page<StockModel> rs = stockRepository.findAll(pageable);

//        ReturnDataClass<StockDTO> list = new ReturnDataClass<>();
//
//        list.setTotalElements(rs.getTotalElements());
//        list.setTotalPages(rs.getTotalPages());
//        list.setCurrentPage(rs.getNumber());
//        list.setPageSize(rs.getSize());
//        list.setFirst(rs.isFirst());
//        list.setLast(rs.isLast());
//
//        List<StockDTO> returnList = StockDTO.fromEntityList(rs.getContent());
//        list.setContent(returnList);


        return  new ReturnDataClass<>(rs.map(StockDTO::fromEntity));

    }


}
