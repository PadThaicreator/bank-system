package com.user;



import com.user.dto.ChangePasswordDTO;
import com.user.dto.LoginDTO;
import com.configuration.common.response.ApiResponse;
import com.models.ReturnClass;
import com.models.ReturnDataClass;
import com.user.dto.UserDTO;
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
        res.put("refreshToken", rs.getRefreshToken());
        res.put("user", rs.getUserLogin());

        return ApiResponse.success("Login Success" , res);
    }

    @PostMapping("/refreshToken")
    public ApiResponse<Map<String, Object>> RefreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        ReturnClass rs = userService.RefreshToken(refreshToken);

        Map<String, Object> res = new HashMap<>();
        res.put("token", rs.getMSG());
        res.put("refreshToken", rs.getRefreshToken());

        return ApiResponse.success("Token Refreshed", res);
    }


    @GetMapping("")
    public ApiResponse<ReturnDataClass<UserDTO> > getAllUser(@RequestParam int size ,@RequestParam int page ) {

        ReturnDataClass<UserDTO> rs = userService.GetAllUser(page,size);





        return ApiResponse.success("get All User Success" , rs);
    }



    @GetMapping("/me")
    public ApiResponse<UserModel> getProfile(java.security.Principal principal) {
        java.util.UUID userId = java.util.UUID.fromString(principal.getName());
        ReturnClass rs = userService.getUserProfile(userId);
        return ApiResponse.success(rs.getMSG(), rs.getUserLogin());
    }

    @PutMapping("/me")
    public ApiResponse<UserModel> updateProfile(java.security.Principal principal, @Valid @RequestBody com.user.dto.UpdateProfileDTO data) {
        java.util.UUID userId = java.util.UUID.fromString(principal.getName());
        ReturnClass rs = userService.updateUserProfile(userId, data);
        return ApiResponse.success(rs.getMSG(), rs.getUserLogin());
    }


    @PutMapping("")
    public ApiResponse<UserModel> editUser(@Valid @RequestBody UserDTO data) {

        ReturnClass rs = userService.editUser(data);

        return ApiResponse.success(rs.getMSG(), null);
    }

    @PutMapping("/password")
    public ApiResponse<UserModel> changePassword(@Valid @RequestBody ChangePasswordDTO data) {

        ReturnClass rs = userService.resetPassword(data.getEmail(),data.getOldPassword() , data.getNewPassword());

        return ApiResponse.success(rs.getMSG(), null);
    }

//    .save();
//    .delete();


}