package com.cinemaocinema.backend.service;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public boolean authenticate(String username, String password) {
        return "siddharth".equals(username) && "Best#123".equals(password);
    }
}
