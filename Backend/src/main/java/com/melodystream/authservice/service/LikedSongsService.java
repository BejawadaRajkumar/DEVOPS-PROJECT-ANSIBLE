package com.melodystream.authservice.service;

import com.melodystream.authservice.model.LikedSongs;
import com.melodystream.authservice.repository.LikedSongsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikedSongsService {

    private final LikedSongsRepository repository;

    public LikedSongsService(LikedSongsRepository repository) {
        this.repository = repository;
    }

    public LikedSongs getLikedSongs(String userId) {
        return repository.findByUserId(userId);
    }

    public String addLikedSong(String userId, String songId) {
        LikedSongs likedSongs = repository.findByUserId(userId);

        if (likedSongs == null) {
            likedSongs = new LikedSongs(userId, List.of(songId));
        } else {
            // prevent duplicates
            if (!likedSongs.getLikedSongIds().contains(songId)) {
                likedSongs.getLikedSongIds().add(songId);
            }
        }

        repository.save(likedSongs);
        return "Song added to liked list!";
    }

    public String removeLikedSong(String userId, String songId) {
        LikedSongs likedSongs = repository.findByUserId(userId);
        if (likedSongs == null) {
            return "No liked songs for user";
        }
        if (likedSongs.getLikedSongIds().contains(songId)) {
            likedSongs.getLikedSongIds().remove(songId);
            repository.save(likedSongs);
            return "Song removed from liked list!";
        }
        return "Song not found in liked list";
    }
}
