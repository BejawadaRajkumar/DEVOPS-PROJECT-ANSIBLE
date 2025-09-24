package com.melodystream.authservice.repository;

import com.melodystream.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    // Add this method to find a user by email
    User findByEmail(String email);
}