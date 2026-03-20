package com.account;

import java.util.List;

import com.account.dto.UserAccountResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
    List<UserAccountResponse> findByUserId(UUID userId);
}
