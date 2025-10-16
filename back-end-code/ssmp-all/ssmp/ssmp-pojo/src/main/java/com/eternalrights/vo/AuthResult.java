package com.eternalrights.vo;

import com.eternalrights.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResult {
    private String token;
    private Integer expiresIn;
    private User user;
    private Boolean success;
}
