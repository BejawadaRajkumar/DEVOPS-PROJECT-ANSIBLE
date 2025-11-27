package com.melodystream.authservice.controller;

import com.melodystream.authservice.model.LikedSongs;
import com.melodystream.authservice.service.LikedSongsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/likes")
public class LikedSongsController {

    private final LikedSongsService service;

    public LikedSongsController(LikedSongsService service) {
        this.service = service;
    }

    @PostMapping("/add/{userId}/{songId}")
    public ResponseEntity<?> likeSong(@PathVariable String userId, @PathVariable String songId) {
        String msg = service.addLikedSong(userId, songId);
        return ResponseEntity.ok(Collections.singletonMap("message", msg));
    }

    @DeleteMapping("/remove/{userId}/{songId}")
    public ResponseEntity<?> unlikeSong(@PathVariable String userId, @PathVariable String songId) {
        String msg = service.removeLikedSong(userId, songId);
        return ResponseEntity.ok(Collections.singletonMap("message", msg));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<LikedSongs> getLikedSongs(@PathVariable String userId) {
        return ResponseEntity.ok(service.getLikedSongs(userId));
    }
}
