package com.melodystream.authservice.repository;

import com.melodystream.authservice.model.LikedSongs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikedSongsRepository extends JpaRepository<LikedSongs, Long> {
    LikedSongs findByUserId(String userId);
}
