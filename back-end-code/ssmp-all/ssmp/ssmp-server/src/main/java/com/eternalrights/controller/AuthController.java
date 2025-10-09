package com.eternalrights.controller;

import com.eternalrights.constant.JwtClaimsConstant;
import com.eternalrights.dto.LoginRequest;
import com.eternalrights.entity.User;
import com.eternalrights.properties.JwtProperties;
import com.eternalrights.result.Result;
import com.eternalrights.service.AuthService;
import com.eternalrights.utilis.JwtUtil;
import com.eternalrights.vo.AuthResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("auth")
@Slf4j
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtProperties jwtProperties;

    @RequestMapping("/user/login")
    public Result<AuthResult> login(@RequestBody LoginRequest loginRequest){
        log.info("用户登录：{}",loginRequest);

        User user = authService.login(loginRequest.getPhoneNumber(), loginRequest.getPassword());

        //登录成功后生成令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtClaimsConstant.USER_ID,user.getId());
        String token = JwtUtil.createJWT(
                jwtProperties.getUserSecretKey(),
                jwtProperties.getUserTtl(),
                claims);

        AuthResult authResult = AuthResult.builder()
                .token(token)
                .expiresIn(jwtProperties.getUserTtl())
                .user(user)
                .success(true)
                .build();

        return Result.success(authResult);
    }
}
