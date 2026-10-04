package com.klu.springmvc.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.klu.springmvc.model.User;
import com.klu.springmvc.repo.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository repo;

    @Autowired
    JWTService jwtService;

    public Object signupService(User u1) {
        Map<String, Object> response = new HashMap<>();

        try {
            User user = repo.findByUsername(u1.getUsername());
            if (user != null) {
                response.put("code", 501);
                response.put("message", "user already exist");
            } else {
                u1.setRole(1);
                repo.save(u1);

                response.put("code", 200);
                response.put("message", "User Registerd Successfully");
            }

            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Object signinService(Map<String, String> u1) {
        Map<String, Object> response = new HashMap<>();

        try {
            User user = repo.findByUsername(u1.get("username"));

            if (user == null || !user.getPassword().equals(u1.get("password"))) {
                response.put("code", "501");
                response.put("message", "Authentication Failed");
            } else {
                response.put("code", 200);
                response.put("jwt", jwtService.generateJWT(u1, user.getRole().toString(), user.getId()));
            }

            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

}
