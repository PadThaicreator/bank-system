package com.repositories;

import com.models.AccountModel;
import com.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface AccountRepository extends JpaRepository<AccountModel, UUID> {

//    UserModel findByEmail(String email);
}
