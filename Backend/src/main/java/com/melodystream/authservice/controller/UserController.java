package com.melodystream.authservice.controller;

import com.melodystream.authservice.model.User;
import com.melodystream.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        String result = userService.signupUser(user);
        return ResponseEntity.ok(Collections.singletonMap("message", result));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        String result = userService.loginUser(user);
        return ResponseEntity.ok(Collections.singletonMap("message", result));
    }

    // ✅ Get All Users (admin feature)

}
