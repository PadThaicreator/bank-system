package com.Transaction;

import com.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TransactionRepository extends JpaRepository<TransactionModel , String> {

    @Query(value = """
        SELECT COUNT(*) 
        FROM transactions t
        WHERE t.reference_no LIKE 
              (:type || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%')
        """, nativeQuery = true)
    int countTodayByType(@Param("type") String type);
}
