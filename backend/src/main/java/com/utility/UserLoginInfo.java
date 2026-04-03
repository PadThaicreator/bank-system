package com.utility;

import com.models.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class UserLoginInfo {

    public static UUID GetUserLoginId(){
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();

        return UUID.fromString(userIdStr);
    }

    public static UserRole checkRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized: No authentication found");
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority())||UserRole.ADMIN.name().equals(a.getAuthority()));

        return isAdmin ? UserRole.ADMIN : UserRole.CUSTOMER;
    }
}
