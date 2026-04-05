package com.request;

import com.models.StatusType;
import com.transaction.TransactionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RequestRepository extends JpaRepository<RequestModel, UUID> {

    @Query(value = """
            SELECT *
            FROM requests req
            WHERE req.request_type LIKE 'OPEN_PORTFOLIO'
            """, nativeQuery = true)
    Page<RequestModel> getRequestPortfolio(Pageable page);


    Page<RequestModel> findByRequestType(RequestType requestType, Pageable pageable);
    Page<RequestModel> findByRequestTypeAndStatus(RequestType requestType, StatusType status, Pageable pageable);

}
