package com.stock;



import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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


    @Transactional
    public void importStock() {


        String url = "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=" + apiKey;

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
            stock.setName(name);
            stock.setType("Common Stock");

            batch.add(stock);
            count++;


            if (count >= 100) break;
        }

        stockRepository.saveAll(batch);

    }

    private boolean isCommonStock(String name) {

        name = name.toLowerCase();


        if (name.contains("etf")) return false;
        if (name.contains("warrant")) return false;
        if (name.contains("right")) return false;
        if (name.contains("unit")) return false;
        if (name.contains("depositary")) return false; // ADR/ADS


        return name.contains("common stock")
                || name.contains("common shares")
                || name.contains("ordinary share");
    }

    private String cleanName(String name) {
        return name.replaceAll(" -.*", "").trim();
    }



}
