package com.eternalrights.service;

import com.eternalrights.entity.User;

public interface AuthService {
    User login(String phoneNumber, String password);
}
