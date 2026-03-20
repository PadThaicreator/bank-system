package com.models;

import com.account.dto.UserAccountResponse;

import com.transaction.dto.TransactionDTO;
import com.user.UserModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReturnDataClass {

    private List<TransactionDTO> transactionList;
    private List<UserModel> userList;
    private List<UserAccountResponse> accountList;

    public List<TransactionDTO> getTransactionList() {
        return transactionList;
    }

    public void setTransactionList(List<TransactionDTO> transactionList) {
        this.transactionList = transactionList;
    }

    public List<UserModel> getUserList() {
        return userList;
    }

    public void setUserList(List<UserModel> userList) {
        this.userList = userList;
    }

    public List<UserAccountResponse> getAccountList() {
        return accountList;
    }

    public void setAccountList(List<UserAccountResponse> accountList) {
        this.accountList = accountList;
    }
}
