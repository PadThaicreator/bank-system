package com.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserModel, UUID> {

    Optional<UserModel> findByEmail(String email);


    boolean existsByEmail(String email);

    long countByStatus(com.models.StatusType status);

    @org.springframework.data.jpa.repository.Query(
        value = "SELECT DISTINCT u.* FROM users u LEFT JOIN accounts a ON CAST(u.id AS varchar) = CAST(a.user_id AS varchar) " +
                "WHERE LOWER(u.full_name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                "OR a.account_number LIKE CONCAT('%', :keyword, '%')", 
        countQuery = "SELECT COUNT(DISTINCT u.id) FROM users u LEFT JOIN accounts a ON CAST(u.id AS varchar) = CAST(a.user_id AS varchar) " +
                     "WHERE LOWER(u.full_name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                     "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                     "OR a.account_number LIKE CONCAT('%', :keyword, '%')",
        nativeQuery = true)
    org.springframework.data.domain.Page<UserModel> searchUsersTree(@org.springframework.data.repository.query.Param("keyword") String keyword, org.springframework.data.domain.Pageable pageable);
}
