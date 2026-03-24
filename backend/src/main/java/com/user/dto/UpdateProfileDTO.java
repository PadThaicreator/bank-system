package com.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProfileDTO {
    @NotBlank(message = "Name is required")
    private String fullName;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate birthDate;
    
    private String gender;
}
