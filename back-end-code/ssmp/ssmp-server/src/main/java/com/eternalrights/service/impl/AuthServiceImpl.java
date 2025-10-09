package com.eternalrights.service.impl;

import com.eternalrights.mapper.UserMapper;
import com.eternalrights.pojo.AuthResult;
import com.eternalrights.pojo.User;
import com.eternalrights.service.AuthService;
import com.eternalrights.utilis.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class AuthServiceImpl implements AuthService{
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtTokenUtil jwtUtil;

    @Override
    public AuthResult auth(String phoneNumber, String password) {
        User user = userMapper.getUserByPhoneNumber(phoneNumber);
        if ( user != null){
            password = DigestUtils.md5DigestAsHex(password.getBytes());
            System.out.println(password);
            if ( !password.equals(user.getPassword())){
                throw new RuntimeException("密码错误");
            } else {
                String token = jwtUtil.generateToken(phoneNumber);
                Integer expiresIn = Math.toIntExact(jwtUtil.getExpirationTime()); // 获取配置的过期时间
                return new AuthResult(token, expiresIn, user, true);
            }
        } else {
            throw new RuntimeException("用户不存在");
        }
    }
}
