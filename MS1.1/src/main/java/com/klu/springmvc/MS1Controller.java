package com.klu.springmvc;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.klu.springmvc.model.User;
import com.klu.springmvc.service.UserService;

@RestController
@RequestMapping("/ms1")
public class MS1Controller {

    @Autowired
    UserService service;

    @GetMapping("/add")
    public String add(@RequestParam("a") int a, @RequestParam("b") int b) {
        int result = a + b;
        return "MS 1.1 - Additon = " + result;
    }

    @PostMapping("/signin")
    public Object signin(@RequestBody Map<String, String> u1) {
        return service.signinService(u1);
    }

    @PostMapping("/signup")
    public Object signup(@RequestBody User u1) {
        return service.signupService(u1);
    }

}
