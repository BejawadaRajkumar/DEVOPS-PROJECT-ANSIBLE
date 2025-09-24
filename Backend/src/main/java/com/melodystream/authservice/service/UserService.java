package com.melodystream.authservice.service;

import com.melodystream.authservice.model.User;
import com.melodystream.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final Pattern userPasswordRegex = Pattern.compile("^(?=.*[a-z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{6,}$");
    private final Pattern adminPasswordRegex = Pattern.compile("^(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$");

    public String signupUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already registered!";
        }

        if ("user".equalsIgnoreCase(user.getRole())) {
            if (!userPasswordRegex.matcher(user.getPassword()).matches()) {
                return "User password must contain at least 6 characters, 1 lowercase letter, 1 number, and 1 special character";
            }
        } else if ("admin".equalsIgnoreCase(user.getRole())) {
            if (!adminPasswordRegex.matcher(user.getPassword()).matches()) {
                return "Admin password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character";
            }
        } else {
            return "Invalid role!";
        }

        userRepository.save(user);
        return "Signup successful!";
    }

    public String loginUser(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return "User not found!";
        }

        if (!existingUser.getRole().equalsIgnoreCase(user.getRole())) {
            return "Role mismatch!";
        }

        if (existingUser.getPassword().equals(user.getPassword())) {
            return "Login successful!";
        } else {
            return "Invalid password!";
        }
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

}