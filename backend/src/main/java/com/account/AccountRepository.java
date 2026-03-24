package com.account;



import com.account.dto.UserAccountResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

   @Query("""
     SELECT new com.account.dto.UserAccountResponse(
      a.id,
      a.accountNumber,
      a.balance,
      a.status,
      a.accountCategory
    )
    FROM Account a
    WHERE a.userId = :userId
    """)
    Page<UserAccountResponse> findByUserId(UUID userId, Pageable pageable);

    Optional<Account> findByAccountNumber(String accountNumber);
}
