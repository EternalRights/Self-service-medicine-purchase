package com.eternalrights.service;

import com.eternalrights.pojo.AuthResult;

public interface AuthService {
    AuthResult auth(String phoneNumber,String password);
}
