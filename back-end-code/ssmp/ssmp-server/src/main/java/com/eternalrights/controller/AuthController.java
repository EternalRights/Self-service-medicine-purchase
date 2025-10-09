package com.eternalrights.controller;

import com.eternalrights.pojo.AuthResult;
import com.eternalrights.pojo.LoginRequest;
import com.eternalrights.pojo.LoginResponse;
import com.eternalrights.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/user/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        log.info("loginRequest: {}", loginRequest);

        AuthResult authResult = authService.auth(loginRequest.getPhoneNumber(), loginRequest.getPassword());
        return new LoginResponse(authResult.getToken(), authResult.getExpiresIn(), authResult.getUser(), null);
    }
}
