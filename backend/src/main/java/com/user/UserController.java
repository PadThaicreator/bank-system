package com.user;



import com.user.dto.LoginDTO;
import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/users")
public class UserController {



    private final UserService  userService;


    public UserController(UserService userService ) {
        this.userService = userService;

    }


    @PostMapping("/register")
    public ApiResponse<ReturnDataClass> Register(@Valid @RequestBody UserModel data) {

         ReturnClass rs = userService.RegisterUser(data);

        return ApiResponse.success(rs.getMSG() ,  null);
    }


    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> Login(@Valid @RequestBody LoginDTO data) {

        ReturnClass rs = userService.Login(data);

        Map<String, Object> res = new HashMap<>();
        res.put("token", rs.getMSG());
        res.put("user", rs.getUserLogin());

        return ApiResponse.success("Login Success" , res);
    }


    @GetMapping("/getAllUser")
    public ApiResponse<List<UserModel>> getAllUser() {

        ReturnClass rs = userService.GetAllUser();



        return ApiResponse.success(rs.getMSG() , rs.getData().getUserList());
    }



//    .save();
//    .delete();


}