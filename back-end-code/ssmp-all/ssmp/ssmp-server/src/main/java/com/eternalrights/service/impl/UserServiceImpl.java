package com.eternalrights.service.impl;

import com.eternalrights.mapper.UserMapper;
import com.eternalrights.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserMapper userMapper;

    @Override
    public String getUserNameById(Integer id) {
        return userMapper.findNameById(id);
    }
}
