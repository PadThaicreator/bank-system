package com.dtos;

import com.models.UserModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class ReturnDataClass {
    private List<UserModel> userList;

    public List<UserModel> getUserList() {
        return userList;
    }

    public void setUserList(List<UserModel> userList) {
        this.userList = userList;
    }
}
