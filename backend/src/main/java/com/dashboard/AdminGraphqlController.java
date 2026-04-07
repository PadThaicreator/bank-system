package com.dashboard;

import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import com.user.UserRepository;
import com.account.AccountRepository;
import com.account.AccountStatus;
import com.transaction.TransactionRepository;
import com.models.StatusType;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.dashboard.dto.UserPageDTO;
import com.user.UserModel;
import com.account.Account;
import java.util.List;
import com.models.AdminDashboardStats;

@Controller
public class AdminGraphqlController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AdminGraphqlController(UserRepository userRepository, AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @QueryMapping
    public AdminDashboardStats adminDashboardStats(@Argument String date) {
        AdminDashboardStats stats = new AdminDashboardStats();

        // 1. Total Users
        stats.setTotalUsers(userRepository.count());

        // 2. Total Accounts
        stats.setTotalAccounts(accountRepository.count());

        // 3. Suspended Users and Accounts
        stats.setSuspendedUsers(userRepository.countByStatus(StatusType.SUSPENDED));
        stats.setSuspendedAccounts(accountRepository.countByStatus(AccountStatus.FROZEN));

        // 4. Today's Transactions
        stats.setTodayTransactionCount(transactionRepository.countTransactionsByDate(date));
        stats.setTodayTransactionValue(transactionRepository.sumTransactionAmountByDate(date));

        return stats;
    }

    @QueryMapping
    public UserPageDTO usersTree(@Argument String searchTerm, @Argument int page, @Argument int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserModel> userPage;
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            userPage = userRepository.findAll(pageable);
        } else {
            userPage = userRepository.searchUsersTree(searchTerm, pageable);
        }
        return new UserPageDTO(userPage);
    }

    @SchemaMapping(typeName="User", field="accounts")
    public List<Account> getAccounts(UserModel user) {
        return accountRepository.findAllByUserId(user.getId());
    }
}
