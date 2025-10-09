package com.eternalrights.service.impl;

import com.eternalrights.entity.User;
import com.eternalrights.mapper.UserMapper;
import com.eternalrights.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class AuthServiceImpl implements AuthService{
    @Autowired
    private UserMapper userMapper;

    @Override
    public User login(String phoneNumber, String password) {
        //1、根据手机号码查询数据库中的数据
        User user = userMapper.findByPhoneNumber(phoneNumber);

        //2.处理各种异常情况
        if ( user == null){
            throw new RuntimeException("用户不存在");
        }

        password = DigestUtils.md5DigestAsHex(password.getBytes());
        System.out.println(password);

        if (!user.getPassword().equals(password)){
            throw new RuntimeException("密码错误");
        }

        return user;
    }
}
