package com.account;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

  Page<Account> findByUserId(UUID userId, Pageable pageable);

  Optional<Account> findByAccountNumber(String accountNumber);

  long countByStatus(AccountStatus status);

  java.util.List<Account> findAllByUserId(UUID userId);
}
