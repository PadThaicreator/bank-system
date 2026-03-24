package com.transaction;

import com.transaction.dto.TransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionModel, String> {

    @Query(value = """
            SELECT COUNT(*)
            FROM transactions t
            WHERE t.reference_no LIKE
                  (:type || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%')
            """, nativeQuery = true)
    int countTodayByType(@Param("type") String type);


    List<TransactionModel> findByFromAccountIdOrToAccountIdOrderByCreatedAtDesc(UUID fromAccountId, UUID toAccountId);


    @Query(value = """
    SELECT *
    FROM transactions t
    WHERE EXISTS (
        SELECT 1
        FROM accounts a
        WHERE a.user_id = :userId
          AND (a.id = t.from_account_id OR a.id = t.to_account_id)
    )
    ORDER BY t.created_at DESC
    """, nativeQuery = true)
    List<TransactionModel> findUserTransactionsNative(@Param("userId") UUID userId);

}
