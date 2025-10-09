package com.eternalrights.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResult {
    private String token;
    private Integer expiresIn;
    private User user;
    private Boolean success;
}
