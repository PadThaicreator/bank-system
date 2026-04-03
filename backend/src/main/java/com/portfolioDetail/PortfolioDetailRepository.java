package com.portfolioDetail;

import com.portfolio.PortfolioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PortfolioDetailRepository extends JpaRepository<PortfolioDetailModel, UUID> {

    PortfolioDetailModel findByPortfolio_IdAndStock_Symbol(UUID portfolioId, String symbol);
    boolean existsByPortfolio_IdAndStock_Symbol(UUID id ,String symbol  );
}
