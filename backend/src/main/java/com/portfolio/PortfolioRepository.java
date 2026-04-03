package com.portfolio;

import com.request.RequestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioModel, UUID> {
    List<PortfolioModel> findByUser_Id(UUID userId);
}
