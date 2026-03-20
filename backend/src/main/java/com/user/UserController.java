package com.user;



import com.user.dto.LoginDTO;
import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/user")
public class UserController {



    private final UserService  userService;


    public UserController(UserService userService ) {
        this.userService = userService;

    }


    @PostMapping("/register")
    public ApiResponse<ReturnDataClass> Register(@Valid @RequestBody UserModel data) {

         ReturnClass rs = userService.RegisterUser(data);

        return ApiResponse.success(rs.getMSG() , rs.getData());
    }


    @PostMapping("/login")
    public ApiResponse<Map<String, String>> Login(@Valid @RequestBody LoginDTO data) {

        ReturnClass rs = userService.Login(data);

        Map<String, String> token = new HashMap<>();
        token.put("token",rs.getMSG());

        return ApiResponse.success("Login Success" , token);
    }


    @GetMapping("/getAllUser")
    public ApiResponse<ReturnDataClass> getAllUser() {

        ReturnClass rs = userService.GetAllUser();



        return ApiResponse.success(rs.getMSG() , rs.getData());
    }



//    .save();
//    .delete();


}