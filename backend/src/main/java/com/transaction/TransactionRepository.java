package com.transaction;

import com.transaction.dto.TransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionModel, UUID> {

    @Query(value = """
            SELECT COUNT(*)
            FROM transactions t
            WHERE t.reference_no LIKE
                  (:type || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%')
            """, nativeQuery = true)
    int countTodayByType(@Param("type") String type);


    Page<TransactionModel> findByFromAccountIdOrToAccountId(
            UUID fromAccountId,
            UUID toAccountId,
            Pageable pageable
    );

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
    Page<TransactionModel> findUserTransactionsNative(@Param("userId") UUID userId , Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM transactions WHERE TO_CHAR(created_at, 'YYYY-MM-DD') = :date", nativeQuery = true)
    long countTransactionsByDate(@Param("date") String date);

    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE TO_CHAR(created_at, 'YYYY-MM-DD') = :date", nativeQuery = true)
    double sumTransactionAmountByDate(@Param("date") String date);

}
